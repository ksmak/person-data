import prisma from "./db";

const ITEMS_PER_PAGE = 8;

export async function fetchSubscriptions() {
  return await prisma.subscription.findMany();
}

export async function fetchFilteredUsers(
  query: string,
  currentPage: number,
  orderBy: string,
  sort: string
) {
  const users = await prisma.user.findMany({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    select: {
      id: true,
      isActive: true,
      lastName: true,
      firstName: true,
      middleName: true,
      login: true,
      expiredPwd: true,
      subs: {
        select: {
          title: true,
        }
      },
    },
    where: {
      OR: [
        {
          firstName: {
            startsWith: `${query}`,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            startsWith: `${query}`,
            mode: "insensitive",
          },
        },
        {
          middleName: {
            startsWith: `${query}`,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      [`${orderBy}`]: `${sort}`,
    },
  });

  return users;
}

export async function fetchUsersPages(query: string) {
  const usersCount = await prisma.user.count({
    where: {
      OR: [
        {
          firstName: {
            startsWith: `${query}`,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            startsWith: `${query}`,
            mode: "insensitive",
          },
        },
        {
          middleName: {
            startsWith: `${query}`,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  const totalPages = Math.ceil(usersCount / ITEMS_PER_PAGE);

  return totalPages;
}

export async function fetchUserById(id: string) {
  const user = prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}

export async function fetchFilteredSubscriptions(
  query: string,
  currentPage: number,
  orderBy: string,
  sort: string
) {
  const subs = await prisma.subscription.findMany({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    where: {
      title: {
        startsWith: `${query}`,
        mode: "insensitive",
      },
    },
    orderBy: {
      [`${orderBy}`]: `${sort}`,
    },
  });

  return subs;
}

export async function fetchSubscriptionsPages(query: string) {
  const subsCount = await prisma.subscription.count({
    where: {
      title: {
        startsWith: `${query}`,
        mode: "insensitive",
      },
    },
  });

  const totalPages = Math.ceil(subsCount / ITEMS_PER_PAGE);

  return totalPages;
}

export async function fetchSubscriptionById(id: string) {
  const sub = prisma.subscription.findUnique({
    where: {
      id: id,
    },
  });

  return sub;
}

export async function fetchFilteredQueries(
  userId: string,
  currentPage: number,
  orderBy: string,
  sort: string
) {
  const queries = await prisma.query.findMany({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    where: {
      userId: userId,
    },
    orderBy: {
      [`${orderBy}`]: `${sort}`,
    },
  });

  return queries;
}

export async function fetchQueriesPages(userId: string) {
  const queriesCount = await prisma.query.count({
    where: {
      userId: userId
    },
  });

  const totalPages = Math.ceil(queriesCount / ITEMS_PER_PAGE);

  return totalPages;
}

export async function fetchQueryById(id: string) {
  const query = prisma.query.findUnique({
    where: {
      id: id,
    },
  });

  return query;
}

export async function fetchDb() {
  return await prisma.db.findMany();
}