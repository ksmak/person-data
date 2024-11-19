import { fetchFilteredQueries } from '@/app/lib/data';
import { TableHead } from '@/app/lib/definitions';
import { Tbl } from '@/app/ui/tables';


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
      <Tbl tableHeads={tableHeads} tableRows={queries} url='/queries' />
    </>
  );
}
