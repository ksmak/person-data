'use client'

import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { logout } from "../lib/actions";

export default function Logout({ username }: { username: string }) {
    return (
        <div className="absolute bottom-10 end-10 flex justify-between items-center gap-2">
            <div className='font-medium hidden md:block'>{username}</div>
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
    );
};