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
      // console.log('connect socket');
    });

    socket.on('query-started', (result) => {
      // console.log('query started: ', result);
      if (result.queryId === queryId) {
        setLoading(true);
        setResults([]);
      }
    })

    socket.on('query-data', (result) => {
      // console.log('query data: ', result);
      if (result.queryId === queryId) {
        setResults(prev => prev.concat([result]));
      }
    })

    socket.on('query-completed', (result) => {
      // console.log('query completed: ', result);
      if (result.queryId === queryId) {
        setLoading(false);
      }
    })

    return () => {
      // console.log('socket disconnect');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className='text-sm italic'>
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
