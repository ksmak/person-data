import { fetchFilteredQueries } from '@/app/lib/data';
import Table from '@/app/ui/queries/table';

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

  return (
    <>
      <Table queries={queries} />
    </>
  );
}
