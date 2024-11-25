import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import WrapTable from '@/app/ui/monitoring/wrap_table';
import { UsersQueriesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchUserByEmail, fetchUsersQueriesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: 'Monitoring',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        orderBy?: string;
        sort?: string;
    }>;
}) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return null;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessMonitoring) return null;

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUsersQueriesPages();
    const orderBy = searchParams?.orderBy || 'fio';
    const sort = searchParams?.sort || 'asc';

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Мониторинг запросов</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Поиск..." />
            </div>
            <Suspense key={query + currentPage} fallback={<UsersQueriesTableSkeleton />}>
                <WrapTable query={query} currentPage={currentPage} orderBy={orderBy} sort={sort} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}