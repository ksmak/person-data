import Form from '@/app/ui/subscriptions/form';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/data';
import { ErrorAccess } from '@/app/ui/error-access';

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.subs?.accessSubscriptions) return <ErrorAccess />;

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