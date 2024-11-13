import moment from "moment";
import { UpdateUser, ConfirmDeleteUser } from '@/app/ui/users/buttons';
import { fetchFilteredUsers } from '@/app/lib/data';
import { User } from '@prisma/client';
import Link from "next/link";



export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await fetchFilteredUsers(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-normal">
                  Статус
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Фамилия
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Имя
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Отчество
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Логин
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Срок действия пароля
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Редактировать</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user: User) => (
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.isActive
                      ? <div className="text-green-600 border border-green-600 p-0 text-center text-xs">Активный</div>
                      : <div className="text-red-600 border border-red-600 p-0 text-center text-xs">Не активный</div>
                    }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.firstName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.middleName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.login}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.expiredPwd && moment(user.expiredPwd).format('DD.MM.YYYY')}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateUser id={user.id} />
                      <ConfirmDeleteUser id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
