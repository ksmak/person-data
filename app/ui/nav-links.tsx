'use client';

import { HiOutlineSearch, HiOutlineKey, HiOutlineDatabase, HiOutlineUserCircle } from "react-icons/hi";
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
  },
  {
    title: 'Подписки',
    href: '/dashboard/subscriptions',
    icon: HiOutlineKey,
    forAdmin: false,
  },
  {
    title: 'Контакты',
    href: '/dashboard/contacts',
    icon: HiOutlineUserCircle,
    forAdmin: false,
  },
  {
    title: 'Администрирование',
    href: '/dashboard/admin',
    icon: HiOutlineDatabase,
    forAdmin: true,
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
              'flex items-center gap-2 rounded-md bg-secondary border border-borderlight text-sm font-medium hover:bg-select hover:text-primarytxt hover:underline p-3 px-3',
              {
                'bg-select text-primarytxt': pathname === link.href,
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
