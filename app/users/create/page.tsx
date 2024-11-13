import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Пользователи', href: '/users' },
                    {
                        label: 'Добавление пользователя',
                        href: '/users/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}