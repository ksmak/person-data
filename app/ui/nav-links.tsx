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
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-secondary p-3 text-sm font-medium hover:bg-select hover:text-primarytxt md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-select text-primarytxt': pathname === link.href,
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
