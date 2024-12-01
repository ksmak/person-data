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
        <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div className="">
                <h1 className="text-2xl text-center w-full mb-5">Подписки</h1>
            </div>
            {subs.map((item) => <SubscriptionCard sub={item} />)}
        </div >
    );
}