import { auth } from "@/auth";
import { fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import SideNav from "@/app/ui/sidenav";
import clsx from "clsx";
import Logout from "../ui/logout";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    return (
        <div className={clsx("flex h-screen w-full flex-col md:flex-row md:overflow-hidden", user?.isAdmin ? "" : "bg-white")}>
            {user?.isAdmin ? <div className="w-full flex-none md:w-64">
                <SideNav user={user} />
            </div> : null}
            <div className="flex-grow p-3 md:overflow-y-auto md:p-12 my-4 mx-3 rounded-md">{children}</div>
            <Logout username={email} />
        </div>
    );
}