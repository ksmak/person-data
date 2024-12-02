'use client';

import { HiOutlineCamera, HiOutlineSearch } from "react-icons/hi";
import { useSearchParams } from 'next/navigation';
import { Btn } from "@/app/ui/buttons";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { search } from "@/app/lib/definitions";

export default function Search() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const extension = file.name.split(".").at(-1);
      setPhoto(file);
      if (inputRef.current) {
        inputRef.current.value = file.name ? file.name : '';
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);

    const validatedFields = search.safeParse({
      body: formData.get('body'),
      photo: formData.get('photo'),
    });

    if (!validatedFields.success) {
      setError(validatedFields.error.flatten().fieldErrors.body?.join(';'))
      event.preventDefault();
      return;
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap mb-5">
        <div className="grow relative flex flex-1 flex-shrink-0">
          <input
            ref={inputRef}
            className="peer block w-full rounded-md border border-borderlight py-[9px] pl-10 pr-8 md:pr-36 text-sm outline-2 placeholder:text-gray-500"
            name="body"
            placeholder="Поиск..."
            defaultValue={searchParams.get('body')?.toString() || searchParams.get('photo')?.toString()}
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          <label htmlFor="uploadFile1"
            className="absolute right-3 top-1/2 h-[18px] -translate-y-1/2 text-gray-600 flex items-center gap-2 hover:cursor-pointer"
          >
            <div className="hidden md:block text-sm underline">загрузить фото</div>
            <HiOutlineCamera className="w-[18px] text-gray-600 peer-focus:text-gray-900" />
            <input
              className="hidden"
              id="uploadFile1"
              type="file"
              name="photo"
              accept=".jpg, .png, .jpeg, .gif, .bmp|image/*"
              onChange={handleUploadPhoto}
            />
          </label>
          <div className="absolute left-0 top-12 text-xs text-red-600">{error}</div>
        </div>
        <Btn type="submit" className="h-10 w-32 self-center flex justify-center">начать поиск</Btn>
      </div>
    </form>
  );
}
