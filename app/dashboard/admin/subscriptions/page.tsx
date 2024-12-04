import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import WrapTable from '@/app/ui/admin/subscriptions/wrap_table';
import { CreateSubscription } from '@/app/ui/admin/subscriptions/buttons';
import { SubsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSubscriptionsPages, fetchUserByEmail } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { ErrorAccess } from '@/app/ui/error-access';
import Breadcrumbs from '@/app/ui/breadcrumbs';

export const metadata: Metadata = {
    title: 'Subscriptions',
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

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchSubscriptionsPages(query);
    const orderBy = searchParams?.orderBy || 'id';
    const sort = searchParams?.sort || 'asc';

    return (
        <div className="w-full">
            <Breadcrumbs
                breadcrumbs={
                    [
                        {
                            label: 'Администрирование', href: '/dashboard/admin'
                        },
                        {
                            label: 'Подписки', href: "/dashboard/admin/subscriptions", active: true
                        },
                    ]}
            />
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Поиск..." />
                <CreateSubscription />
            </div>
            <Suspense key={query + currentPage} fallback={<SubsTableSkeleton />}>
                <WrapTable query={query} currentPage={currentPage} orderBy={orderBy} sort={sort} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}