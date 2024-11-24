const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const random = require("random-name");

const prisma = new PrismaClient();

const salt = bcrypt.genSaltSync(10);

async function main() {
  await prisma.subscription.deleteMany({});

  const sub = await prisma.subscription.create({
    data: {
      title: "Basic",
      maxQueriesDay: 100,
      maxQueriesMonth: 1000,
      maxQueriesTotal: 5000,
      usageTimeLimit: 3,
      accessImportData: false,
      accessUsers: false,
      accessMonitoring: false,
    },
  });

  await prisma.user.deleteMany({});

  // let iin = [];
  // for(let i=0; i <= 12; i++) {
  //   iin.push([String(Math.random * 9)]);
  // }

  for (let i = 0; i <= 10; i++) {
    const first = random.first();
    await prisma.user.create({
      data: {
        isActive: true,
        email: `user${i + 1}@mail.ru`,
        password: bcrypt.hashSync('12345', salt),
        firstName: first,
        lastName: random.last(),
        middleName: random.middle(),
        expiredPwd: new Date(1, 1, 2025),
        subsId: sub.id,
      },
    });
  };

  await prisma.db.deleteMany({});
  await prisma.db.create({
    data: {
      name: "Test DB",
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
