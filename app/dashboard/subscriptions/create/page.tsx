import Form from '@/app/ui/subscriptions/form';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';

export default async function Page() {
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