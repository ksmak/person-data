import { fetchFilteredSubscriptions } from '@/app/lib/data';
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
  const subs = await fetchFilteredSubscriptions(query, currentPage, orderBy, sort);

  const tableHeads: TableHead[] = [
    {
      title: "Наименование",
      name: "title",
      fieldType: "string",
    },
    {
      title: "Количество запросов",
      name: "queriesCount",
      fieldType: "string",
    },
    {
      title: "Цена",
      name: "price",
      fieldType: "string",
    },
  ]

  return (
    <>
      <Tbl tableHeads={tableHeads} tableRows={subs} url="/dashboard/admin/subscriptions" />
    </>
  );
}
