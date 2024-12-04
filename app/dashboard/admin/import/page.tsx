import { ImportForm } from "@/app/ui/admin/import/forms";
import { fetchDb, fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;

    const db = await fetchDb();

    return (
        <div className="w-full">
            <Breadcrumbs
                breadcrumbs={
                    [
                        {
                            label: 'Администрирование', href: '/dashboard/admin'
                        },
                        {
                            label: 'Загрузка данных', href: "/dashboard/admin/import", active: true
                        },
                    ]}
            />
            <ImportForm url={process.env.WS_URL || "http://localhost"} db={db} />
        </div>
    )
}