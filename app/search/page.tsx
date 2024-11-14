import { Metadata } from "next";
import SearchPanel from "@/app/ui/search/panel";

export const metadata: Metadata = {
    title: 'Search',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        orderBy?: string;
        sort?: string;
    }>;
}) {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Поиск информации</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <SearchPanel id="cm3fr4ia10004b1upu6yzw3q1" />
            </div>
            {/* <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
                <WrapTable query={query} currentPage={currentPage} orderBy={orderBy} sort={sort} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div> */}
        </div>
    );
}