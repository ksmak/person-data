import { fetchFilteredUsersQueries } from '@/app/lib/data';
import { TableHead } from '@/app/lib/definitions';
import { Tbl } from '@/app/ui/tables';

export default async function UsersTable({
  query,
  currentPage,
  orderBy,
  sort,
}: {
  query: string;
  currentPage: number;
  orderBy: string;
  sort: string;
}) {
  const users = await fetchFilteredUsersQueries(query, currentPage, orderBy, sort);

  const tableHeads: TableHead[] = [
    {
      title: "Ф.И.О.",
      name: "fio",
      fieldType: 'string',
    },
    {
      title: "Кол-во запросов за день",
      name: "queries_day",
      fieldType: 'string',
    },
    {
      title: "Кол-во запросов за месяц",
      name: "queries_month",
      fieldType: 'string',
    },
    {
      title: "Общее кол-во запросов",
      name: "queries_total",
      fieldType: 'string',
    },
  ]
  return (
    <>
      <Tbl tableHeads={tableHeads} tableRows={users} url='/monitoring' />
    </>
  );
}
