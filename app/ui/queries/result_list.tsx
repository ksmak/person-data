'use client';

import io, { Socket } from 'socket.io-client';
import { Result } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import ResultCard from './result_card';
import { Spinner } from '@material-tailwind/react';
import { useSearchParams } from 'next/navigation';
import { addJobQueriesProccess, createQuery } from '@/app/lib/actions';
import { DefaultEventsMap } from '@socket.io/component-emitter';

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

  return (
    <div>
      <div className='text-xs text-gray-600 md:text-sm italic'>
        {typeof loading === 'undefined'
          ? null
          : loading
            ? <div>Идет поиск данных... <Spinner className="inline ml-2 h-4 w-4 text-primary/50" /></div>
            : <div>Поиск завершен. Найдено: {results.filter(item => !item.error).length}</div>}
      </div>
      {results.map((item: Result, index: number) =>
        item.error
          ? <div key={index} className='bg-secondary rounded my-3 p-2 border border-borderlight text-sm text-red-600'>
            <div>Сервис: {item.service}</div>
            <div>{item.error}</div>
          </div>
          : <ResultCard key={index} result={item} />)}
    </div>
  );
}
