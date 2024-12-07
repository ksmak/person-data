const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { PrismaClient } = require("@prisma/client");
const { io } = require("socket.io-client");
const fs = require("fs");
const path = require("path");
// const OpenAI = require("openai");

let connection;

if (process.env.REDIS_PASSWORD) {
  connection = new IORedis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    family: 6,
    maxRetriesPerRequest: null,
  });
} else {
  connection = new IORedis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
  });
}

const prisma = new PrismaClient();

const socket = io(process.env.WS_URL);

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

//Worker
const worker = new Worker(
  "queries",
  async (job) => {
    switch (job.name) {
      case "load-data":
        loadData(job.data);
        break;
      case "process-queries":
        processQuery(job.data);
        break;
    }
  },
  {
    connection: connection,
  }
);

worker.on("failed", (job, error) => {
  console.log(`Job:${job.name} is failed. ${error.message}`);
});

worker.on("completed", (job) => {
  console.log(`Job:${job.name} is completed.`);
});

//Job load-data
async function loadData(data) {
  let logs = [];
  let error = false;
  let tr = [];

  logs.push(`Начат процесс загрузки данных...`);

  for (const person of data.persons) {
    if (person.iin) {
      try {
        const findPersonByIin = await prisma.person.findFirst({
          where: {
            db: person.db,
            iin: String(person.iin),
          },
        });
        if (findPersonByIin) {
          tr.push(
            prisma.person.update({
              data: {
                firstName: person.firstName,
                lastName: person.lastName,
                middleName: person.middleName,
                phone: person.phone,
                region: person.region,
                district: person.district,
                building: person.building,
                apartment: person.apartment,
                extendedPersonData: person.extendedPersonData,
              },
              where: {
                id: findPersonByIin.id,
              },
            })
          );
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(`Ошибка при проверке ИИН! (${person.iin})! ${e}`);
      }
    }
    if (person.firstName && person.lastName) {
      try {
        const findPersonByFIO = await prisma.person.findFirst({
          where: {
            db: person.db,
            firstName: person.firstName,
            lastName: person.lastName,
            middleName: person.middleName,
          },
        });
        if (findPersonByFIO) {
          // try {
          tr.push(
            prisma.person.update({
              data: {
                iin: String(person.iin),
                phone: person.phone,
                region: person.region,
                district: person.district,
                building: person.building,
                apartment: person.apartment,
                extendedPersonData: person.extendedPersonData,
              },
              where: {
                id: findPersonByFIO.id,
              },
            })
          );
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(
          `Ошибка при проверке ФИО! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
        );
      }
    }
    tr.push(
      prisma.person.create({
        data: {
          dbId: person.dbId,
          firstName: person.firstName,
          lastName: person.lastName,
          middleName: person.middleName,
          iin: String(person.iin),
          phone: person.phone,
          region: person.region,
          district: person.district,
          building: person.building,
          apartment: person.apartment,
          extendedPersonData: person.extendedPersonData,
        },
      })
    );
  }
  try {
    await prisma.$transaction(tr);
  } catch {
    socket.emit("load-completed", {
      error: "В ходе загрузки данных возникли некоторые ошибки.",
      logs: logs,
    });
    error = true;
  }
  logs.push(`Загрузка данных завершена.`);
  if (!error) {
    socket.emit("load-completed", {
      logs: logs,
    });
  }
}

//Job proccess-query
async function processQuery(data) {
  if (!data.queryId) {
    console.log(`Id: ${data.queryId} not exist.`);
    return 0;
  }

  try {
    query = await prisma.query.findUnique({
      where: {
        id: data.queryId,
        state: "WAITING",
      },
    });

    if (!query) {
      console.log(`Query: ${queryId} not found.`);
      return 0;
    }

    socket.emit("query-started", { queryId: query.id });

    let result = [0];

    if (query.body.startsWith("#photo:")) {
      result.push(await getSearch4Faces(query));
    } else {
      result = await Promise.all([
        getPersonsDataAPI(query),
        getUsersBoxAPI(query),
        getChatGPTAPI(query),
      ]);
    }

    await prisma.query.update({
      where: {
        id: query.id,
      },
      data: {
        state: "COMPLETED",
        count: result.reduce((acc, v) => acc + v, 0),
      },
    });

    socket.emit("query-completed", { queryId: query.id });
  } catch (e) {
    console.log(e);
  }
}

async function getPersonsDataAPI(query) {
  try {
    let formattedBody = query.body.trim().toUpperCase().split(" ").join("&");

    let response = await fetch(`${process.env.AUTH_URL}/api/persons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-token": process.env.PERSONS_API_TOKEN,
      },
      body: JSON.stringify({ body: formattedBody }),
    });

    let result = await response.json();

    if (result.status === "success") {
      result.data.map((item) => {
        const rs = {
          queryId: query.id,
          data: item,
          service: "Qarau API",
        };

        console.log("query-data: ", JSON.stringify(rs));

        socket.emit("query-data", rs);
      });
      return result.data.length;
    }

    const rs = {
      queryId: query.id,
      error: result.error,
      service: "Qarau API",
    };

    console.log("query-data: ", JSON.stringify(rs));

    socket.emit("query-data", rs);

    return 0;
  } catch (e) {
    const rs = {
      queryId: query.id,
      error: `Ошибка! Сервис не доступен.`,
      service: "Qarau API",
    };

    console.log("query-data: ", JSON.stringify(rs));

    socket.emit("query-data", rs);

    return 0;
  }
}

async function getUsersBoxAPI(query) {
  const url = `${process.env.USERSBOX_URL}/search?q=${query.body}`;

  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.USERSBOX_API_TOKEN,
        Origin: "*",
      },
    });

    let result = await response.json();

    if (result.status === "success" && result.data?.items) {
      result.data.items.map((item) => {
        const rs = {
          queryId: query.id,
          data: item,
          service: "UsersBox API",
        };

        console.log("query-data: ", rs);

        socket.emit("query-data", rs);
      });
      return result.data.items.length;
    }

    const rs = {
      queryId: query.id,
      data: result.data,
      service: "UsersBox API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  } catch (e) {
    const rs = {
      queryId: query.id,
      error: `Ошибка! Сервис не доступен.`,
      service: "UsersBox API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  }
}

async function getChatGPTAPI(query) {
  const url = process.env.OPENAI_API_URL;
  const apiKey = process.env.OPENAI_API_TOKEN;

  try {
    // const openai = new OpenAI({ apiKey });

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant." },
    //     {
    //       role: "user",
    //       content: "Write a haiku about recursion in programming.",
    //     },
    //   ],
    // });

    // console.log(completion.choices[0].message);

    // const body = JSON.stringify({
    //   model: process.env.OPENAI_API_MODEL,
    //   messages: [
    //     { role: 'system', content: 'You are an assistant helping to find information about people.' },
    //     { role: 'user', content: query.body }
    //   ],
    //   temperature: 0.2
    // });

    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${apiKey}`,
    //     },
    //     body,
    //   });

    //   const data = await response.json();

    // console.log(data);

    return 0;
  } catch (e) {
    const rs = {
      queryId: query.id,
      error: `Ошибка! Сервис не доступен.`,
      service: "ChatGPT API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  }
}

async function getSearch4Faces(query) {
  // Настройки API
  const apiUrl = process.env.SEARCH4FACES_URL;
  const apiKey = process.env.SEARCH4FACES_API_KEY;

  // Функция для выполнения запроса
  async function request(method, params) {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json-rpc",
        "x-authorization-token": apiKey,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Ошибка API: ${JSON.stringify(data.error)}`);
    }

    return data.result;
  }

  // Проверка наличия аргумента в строке body
  let fileName;

  try {
    fileName = query.body.split(":")[1];
  } catch {
    const rs = {
      queryId: query.id,
      error: `Ошибка! Не указан файл.`,
      service: "Search4Faces API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  }

  const imagePath = `/public/uploads/${fileName}`;

  // Проверка файла на существование и формат
  if (!fs.existsSync(imagePath)) {
    const rs = {
      queryId: query.id,
      error: `Ошибка! Файл не существует.`,
      service: "Search4Faces API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const fileExtension = path.extname(imagePath).toLowerCase();

  const isJpeg = fileBuffer
    .subarray(0, 3)
    .equals(Buffer.from([0xff, 0xd8, 0xff]));
  const isPng = fileBuffer
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

  if (![".jpeg", ".jpg", ".png"].includes(fileExtension) && !isJpeg && !isPng) {
    const rs = {
      queryId: query.id,
      error: `Ошибка! Файл не является допустимым .jpeg или .png изображением.`,
      service: "Search4Faces API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  }

  // Кодирование изображения в Base64
  const imageBase64old = fileBuffer.toString("base64");
  const imageBase64 = fs.readFileSync(imagePath, "base64");

  console.log(imageBase64 === imageBase64old);

  try {
    // Детектирование лиц
    const detectFaces = await request("detectFaces", { image: imageBase64 });
    const faces = detectFaces.faces;
    const sources = [
      "vkok_avatar",
      "vk_wall",
      "tt_avatar",
      "ch_avatar",
      "vkokn_avatar",
      "sb_photo",
    ];

    for (let i = 0; i < faces.length; i++) {
      for (let j = 0; j < sources.length; j++) {
        const searchParams = {
          image: detectFaces.image,
          face: faces[i],
          source: sources[j],
          results: 3,
          hidden: true,
        };

        // Поиск лиц
        const searchFace = await request("searchFace", searchParams);

        console.log(JSON.stringify(searchFace));

        if (!searchFace.profiles) {
          return 0;
        }

        searchFace.profiles.map((item) => {
          const rs = {
            queryId: query.id,
            data: item,
            service: "Search4Faces API",
          };

          console.log("query-data: ", rs);

          socket.emit("query-data", rs);
        });

        return searchFace.profiles.length;
      }
    }
  } catch (error) {
    const rs = {
      queryId: query.id,
      error: `Ошибка! ${error}`,
      service: "Search4Faces API",
    };

    console.log("query-data: ", rs);

    socket.emit("query-data", rs);

    return 0;
  }
}
