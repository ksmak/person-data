'use client';

import moment from "moment";
import { User } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";

export default function UsersTable({
  users
}: {
  users: User[]
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const orderBy = searchParams.get('orderBy');
  const sort = searchParams.get('sort');

  const handleOrder = (fieldName: string) => {
    const params = new URLSearchParams(searchParams);
    const sort = params.get('sort');
    params.set('orderBy', fieldName);
    params.set('sort', sort === null ? 'asc' : sort === 'asc' ? 'desc' : 'asc');
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-5 font-normal hover:cursor-pointer"
                  onClick={() => handleOrder('isActive')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Статус</span>
                    {orderBy === 'isActive'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('lastName')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Фамилия</span>
                    {orderBy === 'lastName'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('firstName')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Имя</span>
                    {orderBy === 'firstName'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('middleName')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Отчество</span>
                    {orderBy === 'middleName'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('login')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Логин</span>
                    {orderBy === 'login'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('expiredPwd')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Срок действия пароля</span>
                    {orderBy === 'expiredPwd'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user: User) => (
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/users/${user.id}/edit`)}
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="w-10">
                      {user.isActive
                        ? <div className="w-20 text-green-600 border border-green-600 p-0 text-center text-xs">Активный</div>
                        : <div className="w-20 text-red-600 border border-red-600 p-0 text-center text-xs">Не активный</div>
                      }
                    </div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
