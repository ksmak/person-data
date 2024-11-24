'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Logo from '@/app/ui/logo';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { logout } from '@/app/lib/actions';
import { Session } from 'next-auth';

export default function SideNav({ session }: { session: Session | null }) {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-2 flex h-20 items-center justify-start rounded-md bg-primary p-4 md:h-52"
                href="/dashboard"
            >
                <div className="w-32 text-white md:w-52">
                    <Logo />
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks session={session} />
                <div className="hidden h-auto w-full grow rounded-md bg-secondary md:block"></div>
                {session?.user &&
                    <div className='px-3 flex justify-between items-center gap-4 flex-wrap text-xs bg-secondary border border-gray-200 rounded-md'>
                        <div className='font-bold'>{session?.user?.email}</div>
                        <form
                            action={async () => {
                                await logout();
                            }}
                        >
                            <button className="flex grow items-center justify-center gap-2 rounded-md bg-secondary p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3">
                                <HiArrowRightOnRectangle className="h-4 w-4" />
                                <div className="hidden">Sign Out</div>
                            </button>
                        </form>
                    </div>}
            </div>
        </div>
    );
}
