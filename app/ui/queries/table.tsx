'use client';

import io from 'socket.io-client';
import { TableHead } from "@/app/lib/definitions";
import { Tbl } from "../tables";
import { Query } from "@prisma/client";
import { useEffect, useState } from "react";
import { SearchPanel } from './panels';

export default function QueriesTable({ userId, tableHeads, queries, url
}: { userId: string, tableHeads: TableHead[], queries: Query[], url: string }) {
  const [data, setData] = useState<Query[]>([]);

  useEffect(() => {
    const socket = io(url);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('query-completed', (queryState: { query: Query }) => {
      console.log('query completed');
      setData(prev => {
        let arr = [...prev];
        const i = arr.findIndex((item: Query) => item.id === queryState.query.id);
        if (i >= 0) {
          arr.splice(i, 1, queryState.query);
        }
        return arr;
      })
    })

    setData(queries);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchPanel id={userId} setData={setData} />
      </div>
      <Tbl tableHeads={tableHeads} tableRows={data} url='/dashboard/queries' />
    </>
  );
}
