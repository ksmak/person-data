const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { PrismaClient } = require("@prisma/client");
const { io } = require("socket.io-client");

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

    const result = await Promise.all([
      getPersonsDataAPI(query),
      getUsersBoxAPI(query),
      //getChatGPTAPI(query),
    ]);

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
  const apiKey = process.env.OPENAI_API_TOKEN;

  const url = process.env.OPENAI_API_URL;

  const body = JSON.stringify({
    model: process.env.OPENAI_API_MODEL,
    messages: [
      { role: 'system', content: 'You are an assistant helping to find information about people.' },
      { role: 'user', content: query.body }
    ],
    temperature: 0.2
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

    const data = await response.json();

    console.log(data);

    return 0;
  } catch (e) {

    console.log(e);

    return 0;
  };
}