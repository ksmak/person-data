'use client';

import { Result } from "@/app/lib/definitions";
import ResultCard from '@/app/ui/queries/result_card';
import { HiOutlinePrinter } from 'react-icons/hi';
import { SecondaryBtn } from "@/app/ui/buttons";
import ErrorCard from "@/app/ui/queries/error_card";

export default function ResultList({
  results,
  handlePrint,
  generateUrlForYandex,
  notPhoto,
}: {
  results: Result[],
  handlePrint: () => void,
  generateUrlForYandex: () => string | undefined,
  notPhoto: boolean,
}) {
  const rightResults = results.filter(item => !item.error);

  return (
    <div className='w-full flex flex-col items-center'>
      {rightResults.length > 0 && <div className='w-full flex justify-end'>
        <SecondaryBtn
          className='bg-gray-50 flex items-center gap-2'
          onClick={handlePrint}
        >
          <div className='hidden md:block'>Печать</div>
          <HiOutlinePrinter className='h-5 w-5' />
        </SecondaryBtn>
      </div>}
      {results.map((item: Result, index: number) =>
        item.error
          ? <ErrorCard key={index} result={item} />
          : <ResultCard key={index} result={item} />)}
      <div>
        {rightResults.length > 0 && notPhoto ? <div className='text-sm underline text-blue-600 mt-5'>
          <a
            href={generateUrlForYandex()}
            target='_blank'
          >
            Посмотреть результаты поиска на Yandex
          </a>
        </div> : null}
      </div>
    </div>
  );
}
