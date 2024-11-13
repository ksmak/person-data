import Pagination from '@/app/ui/users/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/users/table';
import { CreateUser } from '@/app/ui/users/buttons';
import { UsersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchUsersPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { ModalDeleteUser } from '../ui/users/modal';

export const metadata: Metadata = {
    title: 'Users',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        confirmDelete?: string;
        id?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUsersPages(query);
    const confirmDelete = searchParams?.confirmDelete || '';
    const id = searchParams?.id || '';

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Пользователи</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Поиск..." />
                <CreateUser />
            </div>
            <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
            {confirmDelete && <ModalDeleteUser id={id} />}
        </div>
    );
}