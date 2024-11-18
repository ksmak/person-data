import { Subscription } from "@prisma/client";

export function SubscriptionCard({
    sub
}: {
    sub: Subscription
}) {
    return (
        <div className='border border-select p-2 rounded-lg h-56 w-96 bg-gray-50'>
            <div className="p-1 font-medium text-center uppercase bg-select text-primarytxt">
                {sub.title}
            </div>
            <div className="font-normal text-sm">
                &#9745; Максимальное кол-во запросов в день: <strong>{sub.maxQueriesDay > 0 ? sub.maxQueriesDay : "неограничено"}</strong>
            </div>
            <div className="font-normal text-sm">
                &#9745; Максимальное кол-во запросов в месяц: <strong>{sub.maxQueriesMonth > 0 ? sub.maxQueriesMonth : "неограничено"}</strong>
            </div>
            <div className="font-normal text-sm">
                &#9745; Максимальное кол-во запросов: <strong>{sub.maxQueriesTotal > 0 ? sub.maxQueriesTotal : "неограничено"}</strong>
            </div>
            <div className="font-normal text-sm">
                &#9745; Ограничение использования системы по времени (в часах): <strong>{sub.usageTimeLimit > 0 ? sub.usageTimeLimit : "неограничено"}</strong>
            </div>
            {sub.accessImportData && <div className="font-normal text-sm">
                &#9745; Доступ к подсистеме "Загрузка данных"
            </div>}
            {sub.accessMonitoring && <div className="font-normal text-sm">
                &#9745; Доступ к подсистеме "Мониторинг запросов"
            </div>}
            {sub.accessUsers && <div className="font-normal text-sm">
                &#9745; Доступ к подсистеме "Пользователи"
            </div>}
        </div>
    )
}