import { auth } from "@/auth";
import { fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;

    return (
        <div>
            {children}
        </div>
    );
}