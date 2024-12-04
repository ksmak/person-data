import { auth } from "@/auth";
import { fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import SideNav from "@/app/ui/sidenav";
import clsx from "clsx";
import Logout from "@/app/ui/logout";
import Logo from "../ui/logo";
import Link from "next/link";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    return (
        <div className="h-screen w-full">
            <SideNav user={user} />
            <div>{children}</div>
        </div>
    );
}