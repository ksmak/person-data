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

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

//Worker
const worker = new Worker(
  "queries",
  async (job) => {
    switch (job.name) {
      case "load-data": loadData(job.data); break;
      case "process-queries": processQuery(job.data); break;
    }
  },
  {
    connection: connection,
  }
);

worker.on('failed', (job, error, prev) => {
  console.log(`Job:${job.name} is failed. ${error.message}`);
});

worker.on('completed', (job) => {
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
          tr.push(prisma.person.update({
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
          }));
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(`Ошибка при проверке ИИН! (${person.iin})! ${e}`);
      }
    };
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
          tr.push(prisma.person.update({
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
          }));
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(
          `Ошибка при проверке ФИО! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
        );
      }
    };
    tr.push(prisma.person.create({
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
    }));
  };
  try {
    await prisma.$transaction(tr);
  } catch (e) {
    socket.emit('load-completed', {
      error: "В ходе загрузки данных возникли некоторые ошибки.",
      logs: logs,
    });
    error = true;
  }
  logs.push(`Загрузка данных завершена.`);
  if (!error) {
    socket.emit('load-completed', {
      logs: logs,
    });
  }
};

//Job proccess-query
async function processQuery(data) {
  console.log("Data: ", data);
  let limit = Number(process.env.LIMIT_RESULT_COUNT);

  try {
    query = await prisma.query.findUnique({
      where: {
        id: data.queryId,
        state: "WAITING",
      },
    });
  } catch (e) {
    console.log(e);
    return;
  }

  socket.emit('query-started', { queryId: query.id });

  await Promise.all([
    getPersons(query.body, limit),
    getUsersBoxAPI(query.body),
  ])


  try {
    await prisma.query.update({
      where: {
        id: query.id,
      },
      data: {
        state: "COMPLETED",
      },
    });
  } catch (e) {
    console.log(e);
  }

  socket.emit('query-completed', { queryId: query.id });
};

async function getPersons(body, limit) {
  try {
    let formattedBody = body.trim().toUpperCase().split(' ').join('&');
    console.log(formattedBody);
    let response = await fetch(`${process.env.AUTH_URL}/api/persons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-token': process.env.PERSONS_API_TOKEN,
      },
      body: JSON.stringify({ body: formattedBody })
    });

    let persons = await response.json();

    console.log(persons);

    if (persons.error) {
      socket.emit('query-data', {
        error: persons.error,
        service: 'Person Data'
      });
      return;
    }

    if (persons.length > limit) {
      socket.emit('query-data', {
        error: 'Слишком много данных. Уточните свой запрос.',
        service: 'Person Data'
      });
      return;
    }

    persons.map(person => {
      socket.emit('query-data', {
        data: person,
        service: 'Person Data'
      });
    });

  } catch (e) {
    console.log(e);
  }
};

async function getUsersBoxAPI(body) {
  const url = `${process.env.USERSBOX_URL}/getMe`;


  try {
    let response = await fetch("https://api.usersbox.ru/v1/getMe", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.USERSBOX_API_TOKEN,
        'Origin': '*',
      },
    });
    let data = await response.json();
    console.log(data);

    if (data.status === 'success' && data.data?.items) {
      data.items.map(item => {
        socket.emit('query-data', {
          data: item,
          service: 'UsersBox API',
        });
      })
    } else {
      socket.emit('query-data', {
        data: data.data,
        service: 'UsersBox API',
      });
    }

  } catch (e) {
    socket.emit('query-data', {
      error: `Ошибка! ${e}`,
      service: 'UsersBox API'
    });
  }
}