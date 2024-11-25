import { ImportForm } from "@/app//ui/import/forms";
import { fetchDb, fetchUserByEmail } from "@/app/lib/data";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return null;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessImportData) return null;

    const db = await fetchDb();

    return (
        <div className="w-full">
            <h1 className="text-2xl text-center pb-5">Загрузка данных</h1>
            <ImportForm url={process.env.WS || "http://localhost:3001"} db={db} />
        </div>
    )
}