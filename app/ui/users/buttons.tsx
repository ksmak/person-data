import { HiOutlinePlusSm, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Link from 'next/link';
import { deleteUser } from '@/app/lib/actions';

export function CreateUser() {
  return (
    <Link
      href="/users/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Добавить нового пользователя</span>{' '}
      <HiOutlinePlusSm className="h-5 md:ml-4" />
    </Link>
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

export function ConfirmDeleteUser({ id }: { id: string }) {
  return (
    <Link
      href={`/users?confirmDelete=true&id=${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <HiOutlineTrash className="w-5" />
    </Link>
  )
}

export function DeleteUser({ id }: { id: string }) {
  const deleteUserWithId = deleteUser.bind(null, id);

  return (
    <form action={deleteUserWithId}>
      <button className="inline-flex w-full justify-center gap-2 items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
        <span>Удалить</span>
        <HiOutlineTrash />
      </button>
    </form>
  );
}
