import { fetchUserByEmail } from "@/app/lib/data";
import NavLinks from "@/app/ui/admin/nav-links";
import { ErrorAccess } from "@/app/ui/error-access";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;
    return (
        <main className="hidden md:flex items-center justify-evenly">
            <NavLinks />
        </main>
    );
};