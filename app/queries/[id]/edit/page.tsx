import { fetchQueryById } from "@/app/lib/data";
import { formatQueryCondition } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/queries/breadcrumbs";
import { PersonCard } from "@/app/ui/queries/cards";
import { Person, Query } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const query = await fetchQueryById(id);

    if (!query) {
        notFound();
    }

    let queryBody;
    try {
        queryBody = formatQueryCondition(JSON.parse(query.body));
    } catch {
        queryBody = [];
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
                            href: `/queries/${id}`,
                            active: true,
                        },
                    ]}
            />
            <div>
                <div className="font-medium mt-5">Параметры поиска:</div>
                <div className="m-2 p-4 bg-secondary rounded-lg">
                    {formatQueryCondition(query.body).map((item: string) => (
                        <div className="font-normal">{item}</div>
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