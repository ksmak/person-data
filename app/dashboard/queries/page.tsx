import { Metadata } from "next";
import { auth } from "@/auth";
import { ErrorAccess } from "@/app/ui/error-access";
import ResultList from "@/app/ui/queries/result_list";
import { createQuery } from "@/app/lib/actions";
import { fetchUserByEmail } from "@/app/lib/data";
import Search from "@/app/ui/queries/search";
import { z, ZodError } from "zod";

export const metadata: Metadata = {
    title: 'Search',
};

const searchSchema = z.string().min(4);

export default async function Page(props: {
    searchParams?: Promise<{
        body?: string;
    }>;
}) {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);
    if (!user) return <ErrorAccess />;

    const searchParams = await props.searchParams;
    const body = searchParams?.body || '';

    let error = '';
    let queryId = '';

    if (body) {
        try {
            searchSchema.parse(body);
            const query = await createQuery(user.id, body);
            queryId = query.id;
        } catch (e) {
            if (e instanceof ZodError) {
                error = "Для поиска необходимо хотя бы 4 символа";
            }
        }
    }

    return (
        <div className="w-full flex flex-col">
            <Search error={error} />
            <div className="mt-3">
                <ResultList url={process.env.WS_URL || "http://localhost:3001"} queryId={queryId} />
            </div>
        </div >
    );
}