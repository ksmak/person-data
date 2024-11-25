import { Metadata } from "next";
import { QueriesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Pagination from "@/app/ui/pagination";
import WrapTable from '@/app/ui/queries/wrap_table';
import { fetchQueriesPages, fetchUserByEmail } from "@/app/lib/data";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: 'Search',
};

export default async function Page(props: {
    searchParams?: Promise<{
        page?: string;
        orderBy?: string;
        sort?: string;
    }>;
}) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return null;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessQueries) return null;

    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchQueriesPages(user.id);
    const orderBy = searchParams?.orderBy || 'createdAt';
    const sort = searchParams?.sort || 'desc';

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Поиск информации</h1>
            </div>
            <Suspense key={currentPage} fallback={<QueriesTableSkeleton />}>
                <WrapTable userId={user.id} currentPage={currentPage} orderBy={orderBy} sort={sort} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}