import { fetchQueryById } from "@/app/lib/data";
import { formatQueryCondition } from "@/app/lib/utils";
import { SecondaryBtn } from "@/app/ui/buttons";
import Breadcrumbs from "@/app/ui/queries/breadcrumbs";
import { PersonCard } from "@/app/ui/queries/cards";
import { Person } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlinePrinter, HiOutlineX } from "react-icons/hi";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const query = await fetchQueryById(id);

    if (!query) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={
                    [
                        {
                            label: 'Поиск информации', href: '/queries'
                        },
                        {
                            label: 'Результаты запроса',
                            href: `/queries/${id}/edit`,
                            active: true,
                        },
                    ]}
            />
            <div>
                <div className="grid grid-cols-3">
                    <div className="col-start-2 justify-self-center font-medium mt-5 italic">Параметры поиска:</div>
                    <div className="justify-self-end flex items-center gap-2">
                        {query.result && <SecondaryBtn className='md:w-28 justify-center '>
                            <Link
                                className='flex items-center gap-1'
                                href={`/queries/${id}/print`}
                            >
                                <span className="hidden md:block">Печать</span>{' '}
                                <HiOutlinePrinter className='h-5 w-5' />
                            </Link>
                        </SecondaryBtn>}
                        <SecondaryBtn className='md:w-28 justify-center'>
                            <Link
                                className='flex items-center gap-1'
                                href="/queries"
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
                {query.result && JSON.parse(query.result).map((item: Person) => (<PersonCard key={item.id} person={item} />))}
            </div>
        </main>
    )
}