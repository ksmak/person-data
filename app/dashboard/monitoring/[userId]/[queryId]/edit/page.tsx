import { fetchQueryById, fetchUserByEmail } from "@/app/lib/data";
import { PersonResult } from "@/app/lib/definitions";
import { formatQueryCondition } from "@/app/lib/utils";
import { SecondaryBtn } from "@/app/ui/buttons";
import { ErrorAccess } from "@/app/ui/error-access";
import Breadcrumbs from "@/app/ui/monitoring/breadcrumbs";
import { auth } from "@/auth";
import { Db, Person } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlinePrinter, HiOutlineX } from "react-icons/hi";

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

    if (!user?.subs?.accessMonitoring) return <ErrorAccess />;

    const params = await props.params;
    const userId = params.userId;
    const queryId = params.queryId;

    const query = await fetchQueryById(queryId);

    if (!query) {
        notFound();
    }

    // const results: PersonResult[] = [];
    // if (query.result) {
    //     try {
    //         JSON.parse(query.result).map((item: PersonResult) => {
    //             results.push(item);
    //         })
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

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
                        },
                        {
                            label: 'Запрос',
                            href: `/dashboard/monitoring/${userId}/edit/${queryId}/edit`,
                            active: true,
                        },
                    ]}
            />
            <div>
                <div className="grid grid-cols-3">
                    <div className="col-start-2 justify-self-center font-medium mt-5 italic">Параметры поиска:</div>
                    <div className="justify-self-end flex items-center gap-2">
                        {/* {query.result && <SecondaryBtn className='md:w-28 justify-center '>
                            <Link
                                className='flex items-center gap-1'
                                href={`/dashboard/queries/${queryId}/print`}
                            >
                                <span className="hidden md:block">Печать</span>{' '}
                                <HiOutlinePrinter className='h-5 w-5' />
                            </Link>
                        </SecondaryBtn>} */}
                        <SecondaryBtn className='md:w-28 justify-center'>
                            <Link
                                className='flex items-center gap-1'
                                href={`/dashboard/monitoring/${userId}/edit`}
                            >
                                <span className="hidden md:block">Закрыть</span>{' '}
                                <HiOutlineX className='h-5 w-5' />
                            </Link>
                        </SecondaryBtn>
                    </div>
                </div>
                <div className="mt-2 p-4 bg-secondary rounded-lg border border-gray-100">
                    {formatQueryCondition(query.body).map((item: string, index: number) => (
                        <div className="font-normal" key={index}>{item}</div>
                    ))}
                </div>
            </div>
            {query.state === 'WAITING'
                ? <div className="mt-5 font-medium border-b border-primary italic">Запрос в процессе обработки</div>
                : <div className="mt-5 font-medium border-b border-primary italic">Запрос обработан. Количество совпадений: <span className="text-gray-950">{query.count}</span></div>
            }
            <div className="max-h-[600px] overflow-y-auto">
                {/* {results.map((item: { Db: Db | null; } & Person) => (<PersonCard key={item.id} person={item} />))} */}
            </div>
        </main>
    );
};