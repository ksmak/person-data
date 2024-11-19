import { fetchFilteredUsers } from '@/app/lib/data';
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
  const users = await fetchFilteredUsers(query, currentPage, orderBy, sort);

  const tableHeads: TableHead[] = [
    {
      title: "Статус",
      name: "isActive",
      fieldType: 'active',
    },
    {
      title: "Фамилия",
      name: "lastName",
      fieldType: 'string',
    },
    {
      title: "Имя",
      name: "firstName",
      fieldType: 'string',
    },
    {
      title: "Отчество",
      name: "middleName",
      fieldType: 'string',
    },
    {
      title: "Логин",
      name: "login",
      fieldType: 'string',
    },
    {
      title: "Срок действия пароля",
      name: "expiredPwd",
      fieldType: 'date',
    },
    {
      title: "Подписка",
      name: "subs",
      fieldType: 'nested',
      nestedName: 'title',
    },
  ]
  return (
    <>
      <Tbl tableHeads={tableHeads} tableRows={users} url='/users' />
    </>
  );
}
