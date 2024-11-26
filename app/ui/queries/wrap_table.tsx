import { fetchFilteredQueries } from '@/app/lib/data';
import { TableHead } from '@/app/lib/definitions';
import QueriesTable from './table';

export default async function WrapTable({
  userId,
  currentPage,
  orderBy,
  sort,
}: {
  userId: string,
  currentPage: number;
  orderBy: string;
  sort: string;
}) {
  const queries = await fetchFilteredQueries(userId, currentPage, orderBy, sort);

  const tableHeads: TableHead[] = [
    {
      title: "Создан",
      name: "createdAt",
      fieldType: "datetime",

    },
    {
      title: "Запрос",
      name: "body",
      fieldType: "queryBody",

    },
    {
      title: "Статус",
      name: "state",
      fieldType: "queryState",

    },
    {
      title: "Количество совпадений",
      name: "count",
      fieldType: "string",

    },
  ]

  return (
    <>
      <QueriesTable userId={userId} tableHeads={tableHeads} queries={queries} url={process.env.WS_URL || "http://localhost"} />
    </>
  );
}
