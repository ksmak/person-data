import { Subscription } from "@prisma/client";
import { Btn } from "@/app/ui/buttons";

export function SubscriptionCard({
    sub
}: {
    sub: Subscription
}) {
    return (
        <div className='border borderlight rounded-lg w-full md:w-96 bg-gray-50 pb-5'>
            <div className="p-1 font-medium text-center uppercase bg-select text-primarytxt rounded-t-lg">
                {sub.title}
            </div>
            <div className="p-1 flex flex-col items-center gap-5">
                <div className="font-normal text-sm">
                    &#9745; Количество запросов: <strong>{sub.queriesCount}</strong>
                </div>
                <div className="font-normal text-sm">
                    &#9745; Цена: <strong>{sub.price}</strong>
                </div>
                <Btn className="">
                    Покупка
                </Btn>
            </div>
        </div>
    )
}