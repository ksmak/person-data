export function TableColSkeleton() {
    return (
        <td className="whitespace-nowrap px-3 py-3">
            <div className="h-6 w-16 rounded bg-gray-100"></div>
        </td>
    );
}

export function UserTableRowSkeleton() {
    return (
        <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <TableColSkeleton />
            <TableColSkeleton />
            <TableColSkeleton />
            <TableColSkeleton />
            <TableColSkeleton />
            <TableColSkeleton />
        </tr>
    );
}

export function UsersTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Статус
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Фамилия
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Имя
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Отчество
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Логин
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Срок действия пароля
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <UserTableRowSkeleton />
                            <UserTableRowSkeleton />
                            <UserTableRowSkeleton />
                            <UserTableRowSkeleton />
                            <UserTableRowSkeleton />
                            <UserTableRowSkeleton />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function SubsTableRowSkeleton() {
    return (
        <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <TableColSkeleton />
        </tr>
    );
}

export function SubsTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Наименование
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <SubsTableRowSkeleton />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function QueriesTableRowSkeleton() {
    return (
        <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <TableColSkeleton />
            <TableColSkeleton />
            <TableColSkeleton />
            <TableColSkeleton />
        </tr>
    );
}

export function QueriesTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Создан
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Условия запроса
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Статус
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Кол-во положительных ответов
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <QueriesTableRowSkeleton />
                            <QueriesTableRowSkeleton />
                            <QueriesTableRowSkeleton />
                            <QueriesTableRowSkeleton />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}