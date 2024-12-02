'use client';

import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineDatabase, HiOutlineChartBar } from "react-icons/hi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { User } from "@prisma/client";

const links = [
    {
        title: 'Пользователи',
        href: '/dashboard/admin/users',
        icon: HiOutlineUser,
    },
    {
        title: 'Подписки',
        href: '/dashboard/admin/subscriptions',
        icon: HiOutlineShieldCheck,
    },
    {
        title: 'Мониторинг запросов',
        href: '/dashboard/admin/monitoring',
        icon: HiOutlineChartBar,
    },
    {
        title: 'Загрузка данных',
        href: '/dashboard/admin/import',
        icon: HiOutlineDatabase,
    },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link, index) => {
                const LinkIcon = link.icon;

                return (
                    <Link
                        key={index}
                        href={link.href}
                        className={clsx(
                            'w-48 flex justify-center items-center gap-2 rounded-md bg-secondary border border-borderlight text-sm font-medium hover:bg-select hover:text-primarytxt p-3 px-3',
                            {
                                'bg-select text-primarytxt': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon />
                        <p>{link.title}</p>
                    </Link>
                );
            })}
        </>
    );
}
