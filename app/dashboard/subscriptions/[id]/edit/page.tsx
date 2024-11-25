import Form from '@/app/ui/subscriptions/form';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import { fetchSubscriptionById, fetchUserByEmail } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return null;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessSubscriptions) return null;

    const params = await props.params;
    const id = params.id;
    const sub = await fetchSubscriptionById(id);

    if (!sub) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={
                    [
                        { label: 'Подписки', href: '/dashboard/subscriptions' },
                        {
                            label: 'Редактирование подписки',
                            href: `/dashboard/subscriptions/${id}/edit`,
                            active: true,
                        },
                    ]}
            />
            <Form sub={sub} />
        </main>
    );
}