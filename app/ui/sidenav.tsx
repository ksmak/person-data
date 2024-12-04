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
        <div className="">
            <Drawer open={open} onClose={closeDrawer} className="p-4">
                <div className="h-full flex flex-col justify-between space-x-0 space-y-2" onClick={closeDrawer}>
                    <div className="mb-3 flex items-center justify-between">
                        <div className='text-md text-gray-700 ml-5'>{user?.email}</div>
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

                    <div
                        className='grow-0 flex justify-between items-center rounded-md bg-secondary border border-borderlight text-sm font-medium hover:bg-select hover:text-primarytxt p-3 px-3 hover:cursor-pointer'
                        onClick={async () => {
                            await logout();
                        }}
                    >
                        <div className='font-medium'>Выйти</div>
                        <HiArrowRightOnRectangle className="h-4 w-4" />
                    </div>
                </div>
            </Drawer>
            <div className="w-full h-24 flex justify-between items-center bg-primary text-white">
                <Logo className='h-20 w-20 flex justify-center items-center ml-5 md:ml-8' />
                <Button className='md:mr-8 mr-5 bg-primary shadow-none hover:shadow-none' onClick={openDrawer}>
                    <HiOutlineMenu className='h-7 w-7' />
                </Button>
            </div>
        </div>
    );
}
