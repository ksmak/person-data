import { Typography } from "@material-tailwind/react";
import { Subscription } from "@prisma/client";

export function SubscriptionCard({
    sub
}: {
    sub: Subscription
}) {
    return (
        <div className='border border-blue-600 p-4 rounded-lg h-64 w-96 bg-slate-100'>
            <Typography color="blue-gray" className="font-medium text-center text-blue-600 uppercase bg-blue-100">
                {sub.title}
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
                &#9745; Максимальное кол-во запросов в день: <strong>{sub.maxQueriesDay > 0 ? sub.maxQueriesDay : "неограничено"}</strong>
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
                &#9745; Максимальное кол-во запросов в месяц: <strong>{sub.maxQueriesMonth > 0 ? sub.maxQueriesMonth : "неограничено"}</strong>
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
                &#9745; Максимальное кол-во запросов: <strong>{sub.maxQueriesTotal > 0 ? sub.maxQueriesTotal : "неограничено"}</strong>
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
                &#9745; Ограничение использования системы по времени (в часах): <strong>{sub.usageTimeLimit > 0 ? sub.usageTimeLimit : "неограничено"}</strong>
            </Typography>
            {sub.accessImportData && <Typography variant="small" color="gray" className="font-normal">
                &#9745; Доступ к подсистеме "Загрузка данных"
            </Typography>}
            {sub.accessMonitoring && <Typography variant="small" color="gray" className="font-normal">
                &#9745; Доступ к подсистеме "Мониторинг запросов"
            </Typography>}
            {sub.accessUsers && <Typography variant="small" color="gray" className="font-normal">
                &#9745; Доступ к подсистеме "Пользователи"
            </Typography>}
        </div>
    )
}