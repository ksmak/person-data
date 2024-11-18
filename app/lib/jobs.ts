const { Prisma } = require("@prisma/client");

function formatStr(s) {
  return s ? s.trim().toUpperCase() : null;
}

function formatInt(s) {
  if (!s) return null;
  if (typeof s === "string") return parseInt(s);
  return s;
}

function formatPhone(s) {
  if (!s) return null;
  const converStr = String(s);
  if (converStr.startsWith("8")) {
    const replaceStr = "7" + converStr.slice(1);
    return parseInt(replaceStr);
  }
  return parseInt(converStr);
}

async function loadData(data) {
  let tx = [];
  let logs = [];
  let persons = [];

  for (const person of data) {
    if (person.iin) {
      const findPersonByIin = await prisma.person.findUnique({
        where: {
          iin: Number(person.iin),
        },
      });
      if (findPersonByIin) {
        try {
          tx.push(
            prisma.person.update({
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
            })
          );
          // persons.push(p);
        } catch (e) {
          logs.push(`Ошибка! ${e}`);
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
          tx.push(
            prisma.person.update({
              data: {
                iin: formatInt(person.iin),
                phone: formatPhone(person.phone),
                region: formatStr(person.region),
                district: formatStr(person.district),
                building: formatStr(person.building),
                apartment: formatStr(person.apartment),
              },
              where: {
                id: findPersonByFIO.id,
              },
            })
          );
          // persons.push(p);
        } catch (e) {
          logs.push(`Ошибка! ${e}`);
        }
        continue;
      }
    }
    try {
      tx.push(
        prisma.person.create({
          data: {
            firstName: formatStr(person.firstName),
            lastName: formatStr(person.lastName),
            middleName: formatStr(person.middleName),
            iin: formatInt(person.iin),
            phone: formatPhone(person.phone),
            region: formatStr(person.region),
            district: formatStr(person.district),
            building: formatStr(person.building),
            apartment: formatStr(person.apartment),
          },
        })
      );
      // persons.push(p);
    } catch (e) {
      logs.push(`Ошибка! ${e}`);
    }
  }
  await prisma.$transaction(tx);
  if (logs.length > 0) {
    return {
      error: "В ходе загрузки данных возникли некоторые ошибки.",
      logs: logs,
    };
  }
  return {
    logs: logs,
    persons: persons,
  };
}

module.exports = {
  loadData
}

exports.loadData = loadData;
