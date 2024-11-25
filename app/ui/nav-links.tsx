'use client';

import { HiOutlineSearch, HiOutlineChartBar, HiOutlineUser, HiOutlineKey, HiOutlineDatabase } from "react-icons/hi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { User } from "@prisma/client";

const links = [
  {
    title: 'Поиск информации',
    name: 'accessQueries',
    href: '/dashboard/queries',
    icon: HiOutlineSearch,
  },
  {
    title: 'Загрузка данных',
    name: 'accessImportData',
    href: '/dashboard/import',
    icon: HiOutlineDatabase,
  },
  {
    title: 'Мониторинг запросов',
    name: 'accessMonitoring',
    href: '/dashboard/monitoring',
    icon: HiOutlineChartBar,
  },
  {
    title: 'Пользователи',
    name: 'accessUsers',
    href: '/dashboard/users',
    icon: HiOutlineUser,
  },
  {
    title: 'Подписки',
    name: 'accessSubscriptions',
    href: '/dashboard/subscriptions',
    icon: HiOutlineKey,
  },
];

export default function NavLinks({ user }: { user: User | null }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        let access: boolean = true;
        switch (link.name) {
          case 'accessQueries': {
            access = user?.subs?.accessQueries ? user?.subs?.accessQueries : true;
            break;
          }
          case 'accessImportData': {
            access = user?.subs?.accessImportData ? user?.subs?.accessImportData : true;
            break;
          }
          case 'accessMonitoring': {
            access = user?.subs?.accessMonitoring ? user?.subs?.accessMonitoring : true;
            break;
          }
          case 'accessUsers': {
            access = user?.subs?.accessUsers ? user?.subs?.accessUsers : true;
            break;
          }
          case 'accessSubscriptions': {
            access = user?.subs?.accessSubscriptions ? user?.subs?.accessSubscriptions : true;
            break;
          }
        }
        const LinkIcon = link.icon;

        if (!access) return (
          <div key={link.name} className="hidden"></div>
        );

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
            <p className="hidden md:block">{link.title}</p>
          </Link>
        );
      })}
    </>
  );
}
