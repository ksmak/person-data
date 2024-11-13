import { fetchFilteredUsers } from '@/app/lib/data';
import Table from '@/app/ui/users/table';

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
  const users = await fetchFilteredUsers(query, currentPage, orderBy, sort);

  return (
    <>
      <Table users={users} />
    </>
  );
}
