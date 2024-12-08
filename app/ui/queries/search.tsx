'use client';

import { HiOutlineCamera, HiOutlineSearch } from "react-icons/hi";
import { Btn, SecondaryBtn } from "@/app/ui/buttons";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Result, search } from "@/app/lib/definitions";
import ResultList from "./result_list";
import { io, } from "socket.io-client";
import { addJobQueriesProccess, createQuery, uploadFile } from "@/app/lib/actions";
import LogoOutline from "../logo-outline";
import { Spinner } from "@material-tailwind/react";
import Image from "next/image";
import clsx from "clsx";

export default function Search({ url, userId }: { url: string, userId: string }) {
  const socket = io(url);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const [loadingFile, setLoadingFile] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [body, setBody] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateUrlForYandex = () => {
    if (!body) return;

    const url = new URL('http://yandex.ru/yandsearch');
    url.searchParams.append('text', body);
    url.searchParams.append('filter', 'people');
    url.searchParams.append('lr', '213');

    return url.toString();
  }

  const handlePrint = async () => {
    try {
      const response = await fetch('/dashboard/queries/print', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results }),
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const header = response.headers.get('Content-Disposition') || 'attachment; filename=results.docx';
      const parts = header.split(';');
      const filename = parts[1].split('=')[1].replaceAll("\"", "");

      const blob = await response.blob();

      if (blob != null) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoadingFile(true);
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const extension = file.name.split(".").at(-1);

      if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg') {
        setMessage('Некорректный формат изображения! Расширение файла должно быть png, jpg или jpeg.');
        setLoadingFile(false);
        return;
      }

      if (file.size > 4500000) {
        setMessage('Размер файла не должен превышать 4.5 Мбайт.');
        setLoadingFile(false);
        return;
      }

      setMessage('Файл загружен.');
      setFile(file);
      setLoadingFile(false);
    };
  };

  const handleDelete = () => {
    setFile(null);

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);

    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    let body = '';

    if (!file) {
      const validatedFields = search.safeParse({
        body: formData.get('body'),
        photo: formData.get('photo'),
      });

      if (!validatedFields.success) {
        setMessage(validatedFields.error.flatten().fieldErrors.body?.join(';') || '');
        setLoading(false);
        return;
      };

      setBody(validatedFields.data.body);
      body = validatedFields.data.body;
    }

    try {
      const query = await createQuery(userId, body, file);

      socket.on('connect', () => {
        // console.log('connect socket');
      });

      socket.on('query-started', (result) => {
        // console.log('query started: ', result);
        if (result.queryId === query.id) {
          setLoading(true);
          setResults([]);
        };
      });

      socket.on('query-data', (result) => {
        // console.log('query data: ', result);
        if (result.queryId === query.id) {
          setResults(prev => prev.concat([result]));
        };
      });

      socket.on('query-completed', (result) => {
        // console.log('query completed: ', result);
        if (result.queryId === query.id) {
          setLoading(false);
        };
      });

      await addJobQueriesProccess(query.id);
    } catch (e) {
      console.log(e);
      setMessage('Ошибка при создании запроса!')
    }
  }

  return (
    <div className="w-full flex flex-col justify-center">
      {file &&
        <div className="my-3 self-center w-24 flex flex-col gap-3">
          <Image alt={file.name || ''}
            src={URL.createObjectURL(file)}
            width={100}
            height={100}
          />
          <SecondaryBtn className="justify-center" onClick={handleDelete}>Удалить</SecondaryBtn>
        </div>}
      <form onSubmit={handleSubmit} className="self-center w-full md:w-4/5 lg:w-1/2 flex flex-col justify-center gap-10">
        <div className="grow relative flex flex-1 flex-shrink-0">
          <input
            ref={inputRef}
            className="peer block w-full rounded-md border border-gray-500 py-[9px] pl-10 pr-8 md:pr-36 text-md outline-none placeholder:text-gray-500"
            name="body"
            placeholder="Поиск..."
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          <label htmlFor="uploadFile1"
            className="absolute right-3 top-1/2 h-[18px] -translate-y-1/2 text-gray-600 flex items-center gap-2 hover:cursor-pointer"
          >
            <div className="hidden md:block text-md underline">загрузить фото</div>
            <HiOutlineCamera className="w-[18px] text-gray-600 peer-focus:text-gray-900" />
            <input
              ref={fileRef}
              className="hidden"
              id="uploadFile1"
              type="file"
              name="photo"
              accept=".png, .jpeg, .jpg"
              onChange={handleChange}
            />
          </label>
          <div className="absolute left-3 top-12 text-xs text-gray-600">
            {message}
          </div>
        </div>
        <Btn
          className={clsx("h-9 w-32 self-center flex justify-center", loading && "bg-none bg-gray-400")}
          type="submit"
          disabled={loading}
        >
          начать поиск
        </Btn>
      </form>
      <div className='mt-3 self-center text-sm text-gray-600 md:text-sm italic flex flex-col'>
        {loadingFile
          && <div>
            Идет загрузка файла... <Spinner className="inline ml-2 h-4 w-4 text-primary/50" />
          </div>}
      </div>
      <div className='self-center text-sm text-gray-600 md:text-sm italic flex flex-col'>
        {typeof loading === 'undefined'
          ? <LogoOutline className="w-48 h-48 md:w-72 md:h-72 flex justify-center items-center" />
          : loading
            ? <div>Идет поиск данных... <Spinner className="inline ml-2 h-4 w-4 text-primary/50" /></div>
            : <div>Поиск завершен. Найдено: {results.filter(item => !item.error).length}</div>}
      </div>
      <ResultList
        results={results}
        handlePrint={handlePrint}
        generateUrlForYandex={generateUrlForYandex}
        notPhoto={!file}
      />
    </div>
  );
}
