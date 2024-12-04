import { fetchQueryById, fetchUserByEmail } from "@/app/lib/data";
import { SecondaryBtn } from "@/app/ui/buttons";
import { ErrorAccess } from "@/app/ui/error-access";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlineX } from "react-icons/hi";

export default async function Page(props: {
    params: Promise<{
        userId: string;
        queryId: string;
    }>
}) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;

    const params = await props.params;
    const userId = params.userId;
    const queryId = params.queryId;

    const query = await fetchQueryById(queryId);

    if (!query) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={
                    [
                        {
                            label: 'Администрирование', href: '/dashboard/admin'
                        },
                        {
                            label: 'Мониторинг запросов', href: '/dashboard/admin/monitoring'
                        },
                        {
                            label: 'Запросы пользователя',
                            href: `/dashboard/admin/monitoring/${userId}/edit`,
                        },
                        {
                            label: 'Запрос',
                            href: `/dashboard/admin/monitoring/${userId}/edit/${queryId}/edit`,
                            active: true,
                        },
                    ]}
            />
            <div>
                <div className="grid grid-cols-3">
                    <div className="col-start-2 justify-self-center font-medium mt-5 italic">Параметры поиска:</div>
                    <div className="justify-self-end flex items-center gap-2">
                        <SecondaryBtn className='md:w-28 justify-center'>
                            <Link
                                className='flex items-center gap-1'
                                href={`/dashboard/admin/monitoring/${userId}/edit`}
                            >
                                <span className="hidden md:block">Закрыть</span>{' '}
                                <HiOutlineX className='h-5 w-5' />
                            </Link>
                        </SecondaryBtn>
                    </div>
                </div>
                <div className="mt-2 p-4 bg-secondary rounded-lg border border-gray-100">
                    {query.body}
                </div>
            </div>
            {query.state === 'WAITING'
                ? <div className="mt-5 font-medium border-b border-primary italic">Запрос в процессе обработки</div>
                : <div className="mt-5 font-medium border-b border-primary italic">Запрос обработан. Количество совпадений:  {query.count}</div>
            }
        </main>
    );
};