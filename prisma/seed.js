const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const random = require("random-name");

const prisma = new PrismaClient();

const salt = bcrypt.genSaltSync(10);

async function main() {
  await prisma.subscription.deleteMany({});

  await prisma.subscription.create({
    data: {
      title: "Ограниченная",
      maxQueriesDay: 0,
      maxQueriesMonth: 0,
      maxQueriesTotal: 1000,
      usageTimeLimit: 3,
      accessQueries: true,
      accessMonitoring: false,
      accessImportData: false,
      accessUsers: false,
      accessSubscriptions: false,
    },
  });
  const sub_base = await prisma.subscription.create({
    data: {
      title: "Базовая",
      maxQueriesDay: 100,
      maxQueriesMonth: 1000,
      maxQueriesTotal: 5000,
      usageTimeLimit: 3,
      accessQueries: true,
      accessImportData: false,
      accessMonitoring: false,
      accessUsers: false,
      accessSubscriptions: false,
    },
  });
  const sub_admin = await prisma.subscription.create({
    data: {
      title: "Максимальная",
      maxQueriesDay: 0,
      maxQueriesMonth: 0,
      maxQueriesTotal: 0,
      usageTimeLimit: 0,
      accessQueries: true,
      accessImportData: true,
      accessMonitoring: true,
      accessUsers: true,
      accessSubscriptions: true,
    },
  });

  await prisma.user.deleteMany({});

  const admin_user = await prisma.user.create({
    data: {
      isActive: true,
      email: `admin@mail.ru`,
      password: bcrypt.hashSync('12345', salt),
      firstName: 'admin',
      lastName: 'admin',
      middleName: 'admin',
      expiredPwd: new Date(1, 1, 2025),
      subsId: sub_admin.id,
      isAdmin: true,
    },
  });

  await prisma.aPI_Token.deleteMany({});

  await prisma.aPI_Token.create({
    data: {
      token: "h+dwB5hszdIJjxvqt8ogmqKjeFFqxZF4rLSXgLDkVAs=",
    }
  });

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
        subsId: sub_base.id,
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
