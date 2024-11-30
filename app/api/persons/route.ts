import { fetchAPIToken } from "@/app/lib/data";
import prisma from "@/app/lib/db";
import { PERSONS_FIELDS_LIST, PERSONS_FULLTEXT_EXP } from "@/app/lib/definitions";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const headersList = await headers();
    const token = headersList.get('api-token');

    if (!token) {
        return Response.json({ error: 'Token not found.' });
    }

    const apiToken = await fetchAPIToken(token);

    if (!apiToken) {
        return Response.json({ error: 'Token incorrect.' });
    }

    const { body } = await req.json();

    if (!body) {
        return Response.json({ error: 'Search query is required' });
    }

    try {
        const results = await prisma.$queryRawUnsafe(`
        SELECT ${PERSONS_FIELDS_LIST}, "Db"."name" "db_name"
            FROM "Person"
            LEFT JOIN "Db" ON  "Person"."dbId" = "Db"."id"
            WHERE to_tsvector(${PERSONS_FULLTEXT_EXP}) @@ to_tsquery($1)
      `, body);

        return Response.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return Response.json({ error: 'An error occurred while searching' });
    }
}