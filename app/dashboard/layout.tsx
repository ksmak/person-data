import SideNav from '@/app/ui/sidenav';
import { auth } from '@/auth';
import { fetchUserByEmail } from '../lib/data';
export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    const email = session?.user?.email;

    const user = email ? await fetchUserByEmail(email) : null

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav user={user} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}