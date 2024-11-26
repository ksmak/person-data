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
      case "process-queries": processQuery(); break;
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
          // try {
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
          // logs.push(`Обновление: ${JSON.stringify(p)}`);
          // } catch (e) {
          // error = true;
          // logs.push(`Ошибка при обновлении! (${person.iin})! ${e}`);
          // }
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
          // logs.push(`Обновление: ${JSON.stringify(p)}`);
          // } catch (e) {
          // error = true;
          // logs.push(
          // `Ошибка при обновлении! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
          // );
          // }
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(
          `Ошибка при проверке ФИО! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
        );
      }
    };
    // try {
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
    // logs.push(`Вставка: ${JSON.stringify(p)}`);
    // } catch (e) {
    // error = true;
    // logs.push(`Ошибка при вставке! (${JSON.stringify(person)})! ${e}`);
    // }
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
async function processQuery() {
  try {
    const queries = await prisma.query.findMany({
      where: {
        state: "WAITING",
      },
    });
    for (query of queries) {
      let persons;
      let state;
      try {
        persons = await prisma.person.findMany({
          where: {
            AND: [...JSON.parse(query.body)],
          },
          include: {
            Db: true,
          }
        })
        state = 'SUCCESS';
      } catch (e) {
        console.log(e);
        state = 'ERROR';
      }
      try {
        const updatedQuery = await prisma.query.update({
          where: {
            id: query.id,
          },
          data: {
            count: persons.length,
            result:
              persons.length > 100
                ? "[]"
                : JSON.stringify(persons),
            state: state,
          },
        });
        socket.emit('query-completed', {
          query: updatedQuery,
        })
      } catch (e) {
        console.log(e);
      }
    };
  } catch (e) {
    try {
      const updatedQuery = await prisma.query.update({
        where: {
          id: query.id,
        },
        data: {
          count: 0,
          result: "[]",
          state: "ERROR",
        },
      });
      socket.emit('query-completed', {
        query: updatedQuery,
      })
    } catch (e) {
      console.log(e);
    }
  }
};
