'use client';

import { Subscription } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";

export default function SubscriptionsTable({
  subs
}: {
  subs: Subscription[]
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
                  className="px-3 py-5 font-normal hover:cursor-pointer"
                  onClick={() => handleOrder('title')}
                >
                  <div className="flex gap-3 items-center">
                    <span>Наименование</span>
                    {orderBy === 'title'
                      ? sort === 'asc' ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />
                      : null}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {subs?.map((sub: Subscription) => (
                <tr
                  key={sub.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/subscriptions/${sub.id}/edit`)}
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {sub.title}
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
