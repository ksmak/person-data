import { HiOutlinePlusSm, HiOutlinePencil } from "react-icons/hi";
import Link from 'next/link';
import { Btn } from "../buttons";

export function CreateUser() {
  return (
    <Btn>
      <Link
        href="/users/create"
        className="flex items-center gap-1"
      >
        <span className="hidden md:block">Добавить нового пользователя</span>{' '}
        <HiOutlinePlusSm className="h-5 w-5" />
      </Link>
    </Btn>
  );
}

export function UpdateUser({ id }: { id: string }) {
  return (
    <Link
      href={`/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <HiOutlinePencil className="w-5" />
    </Link>
  );
}
