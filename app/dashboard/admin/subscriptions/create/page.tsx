import Form from '@/app/ui/admin/subscriptions/form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/data';
import { ErrorAccess } from '@/app/ui/error-access';

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);

    if (!user?.isAdmin) return <ErrorAccess />;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Подписки', href: '/dashboard/admin/subscriptions' },
                    {
                        label: 'Добавление подписки',
                        href: '/dashboard/admin/subscriptions/create',
                        active: true,
                    },
                ]}
            />
            <Form sub={null} />
        </main>
    );
}