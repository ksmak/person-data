'use client';

import io from 'socket.io-client';
import { Result } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import ResultCard from './result_card';

export default function ResultList({ url, queryId }: { url: string, queryId: string }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    const socket = io(url);

    socket.on('connect', () => {
      console.log('connected to server');
    });

    socket.on('query-started', () => {
      setResults([]);
      setLoading(true);
    })

    socket.on('query-data', (data) => {
      if (data.queryId === queryId) {
        setResults(prev => prev.concat([data]));
      }
    })

    socket.on('query-completed', () => {
      setLoading(false);
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className='text-xs italic'>
        {typeof loading === 'undefined'
          ? <div><span className='underline'>Подсказка:</span> Для поиска информации вводите Ф.И.О., номер телефона, адрес и т.д.</div>
          : loading ? <div>Идет поиск данных...</div> : <div>Поиск завершен. Найдено: {results.filter(item => !item.error).length}</div>}
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
