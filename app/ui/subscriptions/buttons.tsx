import { HiOutlinePlusSm, HiOutlinePencil } from "react-icons/hi";
import Link from 'next/link';
import { deleteSubscription } from '@/app/lib/actions';

export function CreateSubscription() {
  return (
    <Link
      href="/subscriptions/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Добавить новую подписку</span>{' '}
      <HiOutlinePlusSm className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSubscription({ id }: { id: string }) {
  return (
    <Link
      href={`/subscriptions/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <HiOutlinePencil className="w-5" />
    </Link>
  );
}
