import { HiOutlinePlusSm, HiOutlinePencil } from "react-icons/hi";
import Link from 'next/link';
import { Btn } from "@/app/ui/buttons";

export function CreateUser() {
  return (
    <Btn>
      <Link
        href="/dashboard/admin/users/create"
        className="flex items-center gap-2"
      >
        <span className="hidden md:block">Добавить нового пользователя</span>
        <HiOutlinePlusSm className="h-5 w-5" />
      </Link>
    </Btn>
  );
}

export function UpdateUser({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/admin/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <HiOutlinePencil className="w-5" />
    </Link>
  );
}
