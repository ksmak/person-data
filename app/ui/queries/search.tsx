'use client';

import { HiOutlineSearch } from "react-icons/hi";
import { useSearchParams } from 'next/navigation';
import { Btn } from "@/app/ui/buttons";

export default function Search({ error }: { error: string }) {
  const searchParams = useSearchParams();

  return (
    <form>
      <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap mb-5">
        <div className="grow relative flex flex-1 flex-shrink-0">
          <input
            className="peer block w-full rounded-md border border-borderlight py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            name="body"
            placeholder="Поиск..."
            defaultValue={searchParams.get('body')?.toString()}
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          <div className="absolute left-0 top-12 text-xs text-red-600">{error}</div>
        </div>
        <Btn type="submit" className="h-10 w-32 self-center flex justify-center">Найти</Btn>
      </div>
    </form>
  );
}
