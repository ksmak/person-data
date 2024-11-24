import Form from '@/app/ui/users/form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchSubscriptions } from '@/app/lib/data';

export default async function Page() {
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