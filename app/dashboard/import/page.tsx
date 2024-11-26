import { ImportForm } from "@/app//ui/import/forms";
import { fetchDb, fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessImportData) return <ErrorAccess />;

    const db = await fetchDb();

    return (
        <div className="w-full">
            <h1 className="text-2xl text-center pb-5">Загрузка данных</h1>
            <ImportForm url={process.env.WS_URL || "http://localhost"} db={db} />
        </div>
    )
}