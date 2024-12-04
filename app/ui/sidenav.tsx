'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Logo from '@/app/ui/logo';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { logout } from '@/app/lib/actions';
import { HiOutlineMenu } from 'react-icons/hi';
import { Button, Drawer, IconButton } from '@material-tailwind/react';
import { useState } from 'react';
import { User } from '@prisma/client';

export default function SideNav({ user }: { user: User | null }) {
    const [open, setOpen] = useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Drawer open={open} onClose={closeDrawer} className="p-4">
                <div className="h-full flex flex-col justify-between space-x-0 space-y-2" onClick={closeDrawer}>
                    <div className="mb-3 flex items-center justify-end">
                        <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </IconButton>
                    </div>
                    <NavLinks user={user} />
                    <div className="grow rounded-md bg-secondary border border-borderlight"></div>
                    <div className='grow-0 flex justify-between items-center rounded-md bg-secondary border border-borderlight text-sm font-medium hover:bg-select hover:text-primarytxt p-3 px-3'>
                        <div className='font-medium'>{user?.email}</div>
                        <form
                            action={async () => {
                                await logout();
                            }}
                        >
                            <button>
                                <HiArrowRightOnRectangle className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </Drawer>
            <Link
                className="mb-2 flex h-20 items-center justify-start rounded-md bg-primary p-4 md:h-52"
                href="/dashboard/queries"
            >
                <div className="w-full text-white md:w-52 flex justify-between md:justify-center items-center">
                    <Logo className='h-16 w-16 md:w-52 md:h-52 flex justify-center items-center' />
                    <Button className='block md:hidden bg-primary' onClick={openDrawer}>
                        <HiOutlineMenu className='h-7 w-7' />
                    </Button>
                </div>
            </Link>
            <div className="hidden md:flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks user={user} />
                <div className="grow rounded-md bg-secondary border border-borderlight"></div>
                <div className='grow-0 flex justify-between items-center rounded-md bg-secondary border border-borderlight text-sm font-medium hover:bg-select hover:text-primarytxt p-3 px-3'>
                    <div className='font-medium hidden md:block'>{user?.email}</div>
                    <form
                        action={async () => {
                            await logout();
                        }}
                    >
                        <button className='hover:cursor-pointer'>
                            <HiArrowRightOnRectangle className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
