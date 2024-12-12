import { Metadata } from "next";
import { auth } from "@/auth";
import { ErrorAccess } from "@/app/ui/error-access";
import { fetchSubscriptions, fetchUserByEmail } from "@/app/lib/data";
import { SubscriptionCard } from "@/app/ui/subscriptions/cards";

export const metadata: Metadata = {
    title: 'Subscriptions',
};

export default async function Page() {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);
    if (!user) return <ErrorAccess />;

    const subs = await fetchSubscriptions();

    return (
        <div className="w-full flex flex-col gap-4 justify-center items-center px-5">
            <div className="">
                <h1 className="mt-10 text-lg md:text-2xl text-center w-full mb-5 text-gray-800 font-bold">Подписки</h1>
            </div>
            <div className="w-full flex flex-col gap-10 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-20">
                {subs.map((item) => <SubscriptionCard key={item.id} sub={item} />)}
            </div>
            <div className="text-sm text-gray-700 mt-6">
                По вопросам покупки подписки обращайтесь к администратору системы
            </div>
        </div >
    );
}