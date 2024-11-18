import { HiOutlinePlusSm, HiOutlinePencil } from "react-icons/hi";
import Link from 'next/link';
import { deleteSubscription } from '@/app/lib/actions';
import { Button } from "../button";

export function CreateSubscription() {
  return (
    <Button>
      <Link
        href="/subscriptions/create"
        className="flex items-center"
      >
        <span className="hidden md:block">Добавить новую подписку</span>{' '}
        <HiOutlinePlusSm className="h-5 md:ml-4" />
      </Link>
    </Button>
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
