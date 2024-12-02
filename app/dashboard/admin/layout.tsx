import { auth } from "@/auth";
import { fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import NavLinks from "@/app/ui/admin/nav-links";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;

    return (
        <div className="h-screen">
            <div className="hidden md:flex items-center justify-evenly">
                <NavLinks />
            </div>
            <div className="flex-grow p-3 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}