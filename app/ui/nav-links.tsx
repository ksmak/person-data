'use client';

import { HiOutlineSearch, HiOutlineChartBar, HiOutlineUser, HiOutlineKey, HiOutlineDatabase } from "react-icons/hi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  {
    name: 'Поиск информации',
    href: '/queries',
    icon: HiOutlineSearch,
  },
  {
    name: 'Загрузка данных',
    href: '/import',
    icon: HiOutlineDatabase,
  },
  {
    name: 'Мониторинг запросов',
    href: '/monitoring',
    icon: HiOutlineChartBar,
  },
  {
    name: 'Пользователи',
    href: '/users',
    icon: HiOutlineUser,
  },
  {
    name: 'Подписки',
    href: '/subscriptions',
    icon: HiOutlineKey,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
