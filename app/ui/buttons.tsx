import clsx from 'clsx';
import Link from 'next/link';
import { HiOutlineSave, HiOutlineTrash, HiOutlineX } from "react-icons/hi";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Btn({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex items-center rounded-lg p-2 text-xs  text-white uppercase bg-gradient-to-t from-emerald500 to-emerald400 hover:shadow-lg hover:shadow-emerald200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald500 active:bg-emerald600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DangerBtn({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex items-center rounded-lg p-2 text-xs  text-white uppercase bg-gradient-to-t from-red-500 to-red-400 hover:shadow-lg hover:shadow-red-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:bg-red-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex items-center rounded-lg p-2 text-xs  text-gray-900 uppercase bg-gradient-to-t from-gray-300 to-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 active:bg-gray-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EditButtonsGroup({ item, handleOpen, url }: {
  item: any,
  handleOpen: () => void,
  url: string,
}) {
  return (
    <>
      {item?.id
        ? <DangerBtn
          onClick={(e) => { e.preventDefault(); handleOpen() }}
          className='md:w-28 justify-center gap-2' >
          <span className="hidden md:block">Удалить</span>{' '}
          <HiOutlineTrash className='h-5 w-5' />
        </DangerBtn >
        : null}
      <Btn type="submit" className='md:w-28 justify-center gap-2'>
        <span className="hidden md:block">Сохранить</span>{' '}
        <HiOutlineSave className='h-5 w-5' />
      </Btn>
      <SecondaryBtn className='md:w-28 justify-center'>
        <Link
          className='flex items-center'
          href={url}
        >
          <span className="hidden md:block">Закрыть</span>{' '}
          <HiOutlineX className='h-5 w-5' />
        </Link>
      </SecondaryBtn>
    </>
  )
}