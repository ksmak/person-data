'use client';

import {
  HiOutlineSearch,
  HiOutlineDatabase,
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineChartBar
} from "react-icons/hi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { User } from "@prisma/client";

const links = [
  {
    title: 'Поиск информации',
    href: '/dashboard/queries',
    icon: HiOutlineSearch,
    forAdmin: false,
    subMenu: false,
  },
  {
    title: 'Администрирование',
    href: '/dashboard/admin',
    icon: HiOutlineDatabase,
    forAdmin: true,
    subMenu: false,
  },
  {
    title: 'Пользователи',
    href: '/dashboard/admin/users',
    icon: HiOutlineUser,
    forAdmin: true,
    subMenu: true,
  },
  {
    title: 'Подписки',
    href: '/dashboard/admin/subscriptions',
    icon: HiOutlineShieldCheck,
    forAdmin: true,
    subMenu: true,
  },
  {
    title: 'Мониторинг запросов',
    href: '/dashboard/admin/monitoring',
    icon: HiOutlineChartBar,
    forAdmin: true,
    subMenu: true,
  },
  {
    title: 'Загрузка данных',
    href: '/dashboard/admin/import',
    icon: HiOutlineDatabase,
    forAdmin: true,
    subMenu: true,
  },
];

export default function NavLinks({ user }: { user: User | null }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, index) => {
        const LinkIcon = link.icon;

        if (link.forAdmin && !user?.isAdmin) return (
          <div key={index} className="hidden"></div>
        );

        return (
          <Link
            key={index}
            href={link.href}
            className={clsx(
              'flex items-center gap-2 rounded-md bg-secondary border border-borderlight text-sm font-medium hover:bg-select hover:text-primarytxt p-3 px-3',
              {
                'bg-select text-primarytxt': pathname === link.href,
                'pl-10': link.subMenu,
              },
            )}
          >
            <LinkIcon />
            <p className="md:block">{link.title}</p>
          </Link>
        );
      })}
    </>
  );
}
