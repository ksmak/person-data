import Form from '@/app/ui/subscriptions/form';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/data';

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return null;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessSubscriptions) return null;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Подписки', href: '/dashboard/subscriptions' },
                    {
                        label: 'Добавление подписки',
                        href: '/dashboard/subscriptions/create',
                        active: true,
                    },
                ]}
            />
            <Form sub={null} />
        </main>
    );
}