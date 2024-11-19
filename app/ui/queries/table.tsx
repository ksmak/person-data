'use client';

import { Query } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import { formatDateToLocal, formatQueryCondition } from "@/app/lib/utils";

export default function QueriesTable({
  queries
}: {
  queries: Query[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
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
                  className="px-3 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('createdAt')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Создан</span>
                    {orderBy === 'createdAt'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="w-96 px-4 py-5 font-medium hover:cursor-pointer"
                >
                  <div className="flex gap-3 items-center">
                    <span>Запрос</span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('state')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Статус</span>
                    {orderBy === 'state'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium hover:cursor-pointer"
                  onClick={() => handleOrder('count')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Кол-во совпадений</span>
                    {orderBy === 'count'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {queries?.map((query: Query) => (
                <tr
                  key={query.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/queries/${query.id}`)}
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {query.createdAt ? formatDateToLocal(query.createdAt.toString()) : ""}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="w-96 h-20 text-wrap overflow-y-auto">{formatQueryCondition(query.body)}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {query.state === 'WAITING'
                      ? <div className="text-orange-600 border border-orange-600 p-0 text-center text-xs w-32">в процессе</div>
                      : query.state === "SUCCESS"
                        ? <div className="text-green-600 border border-green-600 p-0 text-center text-xs w-32">выполнен</div>
                        : <div className="text-red-600 border border-red-600 p-0 text-center text-xs w-32">ошибка</div>
                    }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {query.count}
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
