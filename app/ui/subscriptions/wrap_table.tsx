import { fetchFilteredSubscriptions } from '@/app/lib/data';
import Table from '@/app/ui/subscriptions/table';

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

  return (
    <>
      <Table subs={subs} />
    </>
  );
}
