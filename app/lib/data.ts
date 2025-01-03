import prisma from "@/app/lib/db";
import { ITEMS_PER_PAGE, UsersQueries } from "@/app/lib/definitions";
import { comparePasswords } from "@/app/lib/utils";

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
      email: true,
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
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
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
      userId: userId,
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

export async function getFirstUserId() {
  const user = await prisma.user.findFirst({});
  return user?.id;
}

export async function fetchFilteredUsersQueries(
  query: string,
  currentPage: number,
  orderBy: string,
  sort: string
) {
  const result = await prisma.$queryRawUnsafe(`
    select "User".id, 
    "User"."lastName" || ' ' || "User"."firstName" || ' ' || "User"."middleName" as fio,
    (select count(*) from "Query" where "Query"."userId" = "User".id 
    and make_date(
      cast(date_part('year', "Query"."createdAt") as int),
      cast(date_part('month', "Query"."createdAt") as int),
      cast(date_part('day', "Query"."createdAt") as int)
    ) = current_date) as queries_day,
    (select count(*) from "Query" where "Query"."userId" = "User".id 
    and cast(date_part('month', "Query"."createdAt") as int) = cast(date_part('month', current_date) as int)) as queries_month,
    (select count(*) from "Query" where "Query"."userId" = "User".id) as queries_total
    from "User"
    where "User"."firstName" ilike '%${query}%' or "User"."lastName" ilike '%${query}%' or "User"."middleName" ilike '%${query}%'
    order by ${orderBy} ${sort}
    limit ${ITEMS_PER_PAGE}
    offset ${(currentPage - 1) * ITEMS_PER_PAGE}
  `);
  return result as UsersQueries[];
}

export async function fetchUsersQueriesPages() {
  const queriesCount = await prisma.user.count({});

  const totalPages = Math.ceil(queriesCount / ITEMS_PER_PAGE);

  return totalPages;
}

export async function fetchUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}

export async function fetchUserByEmailAndPassword(
  email: string | unknown,
  password: string | unknown
) {
  if (typeof email !== "string" || typeof password !== "string") return null;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  if (!comparePasswords(password, user.password)) {
    return null;
  }

  return user;
}

export async function fetchAPIToken(token: string) {
  return await prisma.aPI_Token.findUnique({
    where: {
      token: token,
    },
  });
}
