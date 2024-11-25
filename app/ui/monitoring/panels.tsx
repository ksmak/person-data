import { fetchFilteredQueries, fetchQueriesPages, fetchUserById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Pagination from "@/app/ui/pagination";
import { TableHead } from "@/app/lib/definitions";
import { Tbl } from "@/app/ui/tables";

export default async function UserQueriesPanel({
    userId, currentPage, orderBy, sort
}: {
    userId: string;
    currentPage: number;
    orderBy: string;
    sort: string;
}) {


    const user = await fetchUserById(userId);

    if (!user) {
        notFound();
    }

    const queries = await fetchFilteredQueries(userId, currentPage, orderBy, sort);

    const totalPages = await fetchQueriesPages(userId);

    const tableHeads: TableHead[] = [
        {
            title: "Создан",
            name: "createdAt",
            fieldType: "datetime",

        },
        {
            title: "Запрос",
            name: "body",
            fieldType: "queryBody",

        },
        {
            title: "Статус",
            name: "state",
            fieldType: "queryState",

        },
        {
            title: "Количество совпадений",
            name: "count",
            fieldType: "string",

        },
    ]

    return (
        <div className="w-full h-full">
            <div className="text-lg text-gray-900">{user.lastName} {user.firstName} {user.middleName}</div>
            <Tbl tableHeads={tableHeads} tableRows={queries} url={`/dashboard/monitoring/${userId}`} />
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
};