import Form from '@/app/ui/users/form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchSubscriptions, fetchUserByEmail, fetchUserById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { ErrorAccess } from '@/app/ui/error-access';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) return <ErrorAccess />;

    const currentUser = await fetchUserByEmail(email);

    if (!currentUser?.subs?.accessUsers) return <ErrorAccess />;


    const subs = await fetchSubscriptions();
    const params = await props.params;
    const id = params.id;
    const user = await fetchUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={
                    [
                        { label: 'Пользователи', href: '/dashboard/users' },
                        {
                            label: 'Редактирование пользователя',
                            href: `/dashboard/users/${id}/edit`,
                            active: true,
                        },
                    ]}
            />
            <Form user={user} subs={subs} />
        </main>
    );
}