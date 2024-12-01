import Form from '@/app/ui/users/form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchSubscriptions, fetchUserByEmail } from '@/app/lib/data';
import { auth } from '@/auth';
import { ErrorAccess } from '@/app/ui/error-access';

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const currentUser = await fetchUserByEmail(email);

    if (!currentUser?.isAdmin) return <ErrorAccess />;

    const subs = await fetchSubscriptions();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Пользователи', href: '/dashboard/users' },
                    {
                        label: 'Добавление пользователя',
                        href: '/dashboard/admin/users/create',
                        active: true,
                    },
                ]}
            />
            <Form user={null} subs={subs} />
        </main>
    );
}