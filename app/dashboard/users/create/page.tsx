import Form from '@/app/ui/users/form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchSubscriptions, fetchUserByEmail } from '@/app/lib/data';
import { auth } from '@/auth';

export default async function Page() {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return null;

    const currentUser = await fetchUserByEmail(email);

    if (!currentUser?.subs?.accessUsers) return null;

    const subs = await fetchSubscriptions();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Пользователи', href: '/dashboard/users' },
                    {
                        label: 'Добавление пользователя',
                        href: '/dashboard/users/create',
                        active: true,
                    },
                ]}
            />
            <Form user={null} subs={subs} />
        </main>
    );
}