const { Worker } = require("bullmq");
import Redis from "ioredis";
const { PrismaClient } = require("@prisma/client");
const { io } = require("socket.io-client");

const redisConnection = new Redis({
  host: process.env.REDIS_URL,
  port: 6379,
  username: "default",
  password: "e6423dba74e4493a88a5a0f090cf8453",
  family: 6,
});

const prisma = new PrismaClient();

const socket = io("http://localhost:3001");

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
    connection: redisConnection,
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
          try {
            const p = await prisma.person.update({
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
            });
            logs.push(`Обновление: ${JSON.stringify(p)}`);
          } catch (e) {
            error = true;
            logs.push(`Ошибка при обновлении! (${person.iin})! ${e}`);
          }
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
          try {
            const p = await prisma.person.update({
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
            });
            logs.push(`Обновление: ${JSON.stringify(p)}`);
          } catch (e) {
            error = true;
            logs.push(
              `Ошибка при обновлении! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
            );
          }
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(
          `Ошибка при проверке ФИО! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
        );
      }
    };
    try {
      const p = await prisma.person.create({
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
      });
      logs.push(`Вставка: ${JSON.stringify(p)}`);
    } catch (e) {
      error = true;
      logs.push(`Ошибка при вставке! (${JSON.stringify(person)})! ${e}`);
    }
  };
  logs.push(`Загрузка данных завершена.`);
  if (error) {
    socket.emit('dataload-completed', {
      error: "В ходе загрузки данных возникли некоторые ошибки.",
      logs: logs,
    });
  } else {
    socket.emit('load-completed', {
      logs: logs,
    });
  };
};

//Job proccess-query
async function processQuery() {
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
    console.log(persons)
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
};
