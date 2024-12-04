'use client';

import io, { Socket } from 'socket.io-client';
import { Result } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import ResultCard from '@/app/ui/queries/result_card';
import { Spinner } from '@material-tailwind/react';
import { useSearchParams } from 'next/navigation';
import { addJobQueriesProccess, createQuery } from '@/app/lib/actions';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { SecondaryBtn } from '@/app/ui/buttons';
import { HiOutlinePrinter } from 'react-icons/hi';
import LogoOutline from '@/app/ui/logo-outline';

export default function ResultList({ url, userId }: { url: string, userId: string }) {
  const searchParams = useSearchParams();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const startSearch = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
    const body = searchParams.get('body');

    if (!body) return;

    const query = await createQuery(userId, body);

    if (!query) return;

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
  };

  useEffect(() => {
    const socket = io(url);

    startSearch(socket);

    return () => {
      // console.log('socket disconnect');
      socket.disconnect();
    };
  }, []);

  const generateUrlForYandex = () => {
    const body = searchParams.get('body');

    if (!body) return;

    const formattedBody = body.trim().split(' ').join('+');

    console.log(formattedBody);

    const url = new URL('http://yandex.ru/yandsearch');
    url.searchParams.append('text', body);
    url.searchParams.append('filter', 'people');
    url.searchParams.append('lr', '213');

    return url.toString();
  }

  const handlePrint = async () => {
    try {
      const response = await fetch('/dashboard/print', {
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

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='text-sm text-gray-600 md:text-sm italic flex flex-col'>
        {typeof loading === 'undefined'
          ? <LogoOutline className="w-48 h-48 md:w-72 md:h-72 flex justify-center items-center" />
          : loading
            ? <div>Идет поиск данных... <Spinner className="inline ml-2 h-4 w-4 text-primary/50" /></div>
            : <div>Поиск завершен. Найдено: {results.filter(item => !item.error).length}</div>}
      </div>
      {typeof loading !== 'undefined' && loading === false ? <div className='w-full flex justify-end'>
        <SecondaryBtn
          className='bg-gray-50 flex items-center gap-2'
          onClick={handlePrint}
        >
          <div className='hidden md:block'>Печать</div>
          <HiOutlinePrinter className='h-5 w-5' />
        </SecondaryBtn>
      </div>
        : null}
      {results.map((item: Result, index: number) =>
        item.error
          ? <div key={index} className='w-full bg-secondary rounded my-3 border border-borderlight text-sm text-red-600 flex gap-1'>
            <div>Сервис: {item.service},</div>
            <div>{item.error}</div>
          </div>
          : <ResultCard key={index} result={item} />)}
      {typeof loading !== 'undefined' && loading === false ?
        <div>
          <div className='text-sm underline text-blue-600 mt-5'>
            <a
              href={generateUrlForYandex()}
              target='_blank'
            >
              Посмотреть результаты поиска на Yandex
            </a>
          </div>
        </div>
        : null
      }
    </div>
  );
}
