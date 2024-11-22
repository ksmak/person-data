import { Metadata } from "next";
import { QueriesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Pagination from "@/app/ui/pagination";
import WrapTable from '@/app/ui/queries/wrap_table';
import { fetchQueriesPages, getFirstUserId } from "@/app/lib/data";

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
    const userId = await getFirstUserId(); //for test!!!
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchQueriesPages(userId);
    const orderBy = searchParams?.orderBy || 'createdAt';
    const sort = searchParams?.sort || 'desc';

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Поиск информации</h1>
            </div>
            <Suspense key={currentPage} fallback={<QueriesTableSkeleton />}>
                <WrapTable userId={userId} currentPage={currentPage} orderBy={orderBy} sort={sort} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}