import { HiOutlinePlusSm, HiOutlinePencil } from "react-icons/hi";
import Link from 'next/link';
import { Btn } from "@/app/ui/buttons";

export function CreateSubscription() {
  return (
    <Btn>
      <Link
        href="/subscriptions/create"
        className="flex items-center g-1"
      >
        <span className="hidden md:block">Добавить новую подписку</span>{' '}
        <HiOutlinePlusSm className="h-5 w-5" />
      </Link>
    </Btn>
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
