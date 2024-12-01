import { fetchAPIToken } from "@/app/lib/data";
import prisma from "@/app/lib/db";
import {
  PersonResult,
  PERSONS_FIELDS_LIST,
  PERSONS_FULLTEXT_EXP,
} from "@/app/lib/definitions";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const headersList = await headers();
  const token = headersList.get("api-token");

  if (!token) {
    return Response.json({
      status: "error",
      error: "Token not found.",
      data: [],
    });
  }

  const apiToken = await fetchAPIToken(token);

  if (!apiToken) {
    return Response.json({
      status: "error",
      error: "Token incorrect.",
      data: [],
    });
  }

  const { body } = await req.json();

  if (!body) {
    return Response.json({
      status: "error",
      error: "Search query is required",
      data: [],
    });
  }

  try {
    const data = (await prisma.$queryRawUnsafe(
      `
        SELECT ${PERSONS_FIELDS_LIST}, "Db"."name" "db_name"
            FROM "Person"
            LEFT JOIN "Db" ON  "Person"."dbId" = "Db"."id"
            WHERE to_tsvector(${PERSONS_FULLTEXT_EXP}) @@ to_tsquery($1)
      `,
      body
    )) as PersonResult[];

    const limit = process.env.LIMIT_RESULT_COUNT
      ? Number(process.env.LIMIT_RESULT_COUNT)
      : 100;

    if (data.length > limit) {
      return Response.json({
        status: "error",
        error: "Results more than limit",
        data: [],
      });
    }

    return Response.json({ status: "success", data: data });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({
      status: "error",
      error: "An error occurred while searching",
      data: [],
    });
  }
}
