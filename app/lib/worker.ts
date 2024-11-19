const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { PrismaClient } = require("@prisma/client");
const { jobHandler } = require("./jobs.ts");

const redisConnection = new Redis("redis://redis:6379", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

const prisma = new PrismaClient();

function formatStr(s) {
  return s ? String(s).trim().toUpperCase() : null;
}

function formatPhone(s) {
  const converStr = String(s);
  if (converStr.startsWith("8")) {
    return "7" + converStr.slice(1);
  }
  return converStr;
}

const worker = new Worker(
  "queries",
  async (job) => {
    if (job.name === "load-data") {
      let logs = [];
      let persons = [];
      let error = false;

      logs.push(`Начат процесс загрузки данных...`);
      for (const person of job.data.persons) {
        if (person.iin) {
          const findPersonByIin = await prisma.person.findUnique({
            where: {
              iin: formatStr(person.iin),
            },
          });
          if (findPersonByIin) {
            try {
              const p = await prisma.person.update({
                data: {
                  firstName: formatStr(person.firstName),
                  lastName: formatStr(person.lastName),
                  middleName: formatStr(person.middleName),
                  phone: formatPhone(person.phone),
                  region: formatStr(person.region),
                  district: formatStr(person.district),
                  building: formatStr(person.building),
                  apartment: formatStr(person.apartment),
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
        }
        if (person.firstName && person.lastName) {
          const findPersonByFIO = await prisma.person.findFirst({
            where: {
              firstName: formatStr(person.firstName),
              lastName: formatStr(person.lastName),
              middleName: formatStr(person.middleName),
            },
          });
          if (findPersonByFIO) {
            try {
              const p = await prisma.person.update({
                data: {
                  iin: formatStr(person.iin),
                  phone: formatPhone(person.phone),
                  region: formatStr(person.region),
                  district: formatStr(person.district),
                  building: formatStr(person.building),
                  apartment: formatStr(person.apartment),
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
        }
        try {
          const p = await prisma.person.create({
            data: {
              firstName: formatStr(person.firstName),
              lastName: formatStr(person.lastName),
              middleName: formatStr(person.middleName),
              iin: formatStr(person.iin),
              phone: formatPhone(person.phone),
              region: formatStr(person.region),
              district: formatStr(person.district),
              building: formatStr(person.building),
              apartment: formatStr(person.apartment),
            },
          });
          logs.push(`Вставка: ${JSON.stringify(p)}`);
        } catch (e) {
          error = true;
          logs.push(`Ошибка при вставке! (${JSON.stringify(person)})! ${e}`);
        }
      }
      logs.push(`Загрузка данных завершена.`);
      if (error) {
        return {
          error: "В ходе загрузки данных возникли некоторые ошибки.",
          logs: logs,
        };
      } else {
        return {
          logs: logs,
          persons: persons,
        };
      }
    }
    if (job.name === "process-queries") {
      const queries = await prisma.query.findMany({
        where: {
          state: "WAITING",
        },
      });
      for (query of queries) {
        const persons = await prisma.person.findMany({
          where: {
            OR: [...JSON.parse(query.body)],
          },
        });
        await prisma.query.update({
          where: {
            id: query.id,
          },
          data: {
            count: persons.length,
            result:
              persons.length > 100
                ? "Найдено больше 100 записей"
                : JSON.stringify(persons),
            state: "SUCCESS",
          },
        });
      }
    }
  },
  {
    connection: redisConnection,
    removeOnComplete: { count: 0 },
    removeOnFail: { count: 0 },
  }
);
