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
            <div className="text-gray-800 font-medium">Количество совпадений: <span className="text-gray-950">{query.count}</span></div>
            <div>
                <div>Запрос:</div>
                <div className="">
                    {formatQueryCondition(JSON.parse(query.body)).map((item: string) => (
                        <div>{item}</div>
                    ))}
                </div>
            </div>
            <div className="overflow-y-auto">
                {query.result && JSON.parse(query.result).map((item: Person) => (<PersonCard key={item.id} person={item} />))}
            </div>
        </main>
    )
}