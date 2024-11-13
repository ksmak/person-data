import prisma from "./db";

const ITEMS_PER_PAGE = 2;

export async function fetchFilteredUsers(
    query: string,
    currentPage: number,
    orderBy: string,
    sort: string,
) {

    const users = await prisma.user.findMany({
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        where: {
            OR: [
                {
                    firstName: {
                        startsWith: `${query}`,
                        mode: 'insensitive',
                    },
                },
                {
                    lastName: {
                        startsWith: `${query}`,
                        mode: 'insensitive',
                    },
                },
                {
                    middleName: {
                        startsWith: `${query}`,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: {
            [`${orderBy}`]: `${sort}`
        }
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
                        mode: 'insensitive',
                    },
                },
                {
                    lastName: {
                        startsWith: `${query}`,
                        mode: 'insensitive',
                    },
                },
                {
                    middleName: {
                        startsWith: `${query}`,
                        mode: 'insensitive',
                    },
                },
            ],
        },
    })

    const totalPages = Math.ceil(usersCount / ITEMS_PER_PAGE);

    return totalPages;
}

export async function fetchUserById(id: string) {
    const user = prisma.user.findUnique({
        where: {
            id: id
        }
    })

    return user;
}