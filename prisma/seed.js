const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const random = require("random-name");

const prisma = new PrismaClient();

const salt = bcrypt.genSaltSync(10);

async function main() {
  await prisma.subscription.deleteMany({});

  prisma.subscription.create({
    data: {
      title: "100 queries",
      queriesCount: 100,
      price: 500,
    },
  });
  await prisma.subscription.create({
    data: {
      title: "500 queries",
      queriesCount: 500,
      price: 2000,
    },
  });
  await prisma.subscription.create({
    data: {
      title: "1000 queries",
      queriesCount: 1000,
      price: 3500,
    },
  });
  await prisma.subscription.create({
    data: {
      title: "5000 queries",
      queriesCount: 5000,
      price: 5000,
    },
  });
  await prisma.subscription.create({
    data: {
      title: "10000 queries",
      queriesCount: 10000,
      price: 9000,
    },
  });
  await prisma.subscription.create({
    data: {
      title: "unlimit",
      queriesCount: 0,
      price: 50000,
    },
  });

  await prisma.user.deleteMany({});

  const admin_user = await prisma.user.create({
    data: {
      isActive: true,
      isAdmin: true,
      email: `admin@mail.ru`,
      password: bcrypt.hashSync("12345", salt),
      firstName: "admin",
      lastName: "admin",
      middleName: "admin",
      balance: 1000,
    },
  });

  await prisma.aPI_Token.deleteMany({});

  await prisma.aPI_Token.create({
    data: {
      userId: admin_user.id,
      token: "h+dwB5hszdIJjxvqt8ogmqKjeFFqxZF4rLSXgLDkVAs=",
    },
  });

  for (let i = 0; i <= 10; i++) {
    const first = random.first();
    await prisma.user.create({
      data: {
        isActive: true,
        email: `user${i + 1}@mail.ru`,
        password: bcrypt.hashSync("12345", salt),
        firstName: first,
        lastName: random.last(),
        middleName: random.middle(),
        balance: 100,
      },
    });
  }

  await prisma.db.deleteMany({});

  await prisma.db.create({
    data: {
      name: "Test DB",
    },
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
