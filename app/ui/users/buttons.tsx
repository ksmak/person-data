import { HiOutlinePlusSm, HiOutlinePencil } from "react-icons/hi";
import Link from 'next/link';
import { Button } from "../button";

export function CreateUser() {
  return (
    <Button>
      <Link
        href="/users/create"
        className="flex items-center"
      >
        <span className="hidden md:block">Добавить нового пользователя</span>{' '}
        <HiOutlinePlusSm className="h-5 md:ml-4" />
      </Link>
    </Button>
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
