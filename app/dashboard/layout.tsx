import { auth } from "@/auth";
import { fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import SideNav from "@/app/ui/sidenav";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav user={user} />
            </div>
            <div className="flex-grow p-3 md:overflow-y-auto md:p-12 bg-secondary my-4 mx-3 rounded-md">{children}</div>
        </div>
    );
}