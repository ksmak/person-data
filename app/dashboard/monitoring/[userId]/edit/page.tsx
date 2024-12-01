import { fetchUserByEmail } from "@/app/lib/data";
import { SecondaryBtn } from "@/app/ui/buttons";
import { ErrorAccess } from "@/app/ui/error-access";
import UserQueriesPanel from "@/app/ui/monitoring/panels";
import Breadcrumbs from "@/app/ui/users/breadcrumbs";
import { auth } from "@/auth";
import Link from "next/link";
import { HiOutlineX } from "react-icons/hi";

export default async function Page(props: {
    params: Promise<{
        userId: string;
        page?: string;
        orderBy?: string;
        sort?: string;
    }>
}) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessMonitoring) return <ErrorAccess />;

    const params = await props.params;
    const userId = params.userId;
    const currentPage = Number(params?.page) || 1;
    const orderBy = params?.orderBy || 'createdAt';
    const sort = params?.sort || 'desc';

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={
                    [
                        {
                            label: 'Мониторинг запросов', href: '/dashboard/monitoring'
                        },
                        {
                            label: 'Запросы пользователя',
                            href: `/dashboard/monitoring/${userId}/edit`,
                            active: true,
                        },
                    ]}
            />
            <div className="flex justify-end">
                <SecondaryBtn className='md:w-28 justify-center'>
                    <Link
                        className='flex items-center gap-1'
                        href={`/dashboard/monitoring`}
                    >
                        <span className="hidden md:block">Закрыть</span>{' '}
                        <HiOutlineX className='h-5 w-5' />
                    </Link>
                </SecondaryBtn>
            </div>
            <UserQueriesPanel
                userId={userId}
                currentPage={currentPage}
                orderBy={orderBy}
                sort={sort}
            />
        </main>
    );
}