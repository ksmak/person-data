const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { PrismaClient } = require("@prisma/client");
const { io } = require("socket.io-client");

const redisConnection = new Redis("redis://redis:6379", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
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

//Job load-data
async function loadData(data) {
  let logs = [];
  let persons = [];
  let error = false;

  logs.push(`Начат процесс загрузки данных...`);
  for (const person of data.persons) {
    if (person.iin) {
      const findPersonByIin = await prisma.person.findUnique({
        where: {
          iin: person.iin,
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
    };
    if (person.firstName && person.lastName) {
      const findPersonByFIO = await prisma.person.findFirst({
        where: {
          firstName: person.firstName,
          lastName: person.lastName,
          middleName: person.middleName,
        },
      });
      if (findPersonByFIO) {
        try {
          const p = await prisma.person.update({
            data: {
              iin: person.iin,
              phone: person.phone,
              region: person.region,
              district: person.district,
              building: person.building,
              apartment: person.apartment,
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
    };
    try {
      const p = await prisma.person.create({
        data: {
          firstName: person.firstName,
          lastName: person.lastName,
          middleName: person.middleName,
          iin: person.iin,
          phone: person.phone,
          region: person.region,
          district: person.district,
          building: person.building,
          apartment: person.apartment,
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
              ? "Найдено больше 100 записей"
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
