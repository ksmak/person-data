import { fetchUserById } from "@/app/lib/data";
import { UserQueriesPanel } from "@/app/ui/monitoring/panels";
import Breadcrumbs from "@/app/ui/queries/breadcrumbs";
import { notFound } from "next/navigation";

export async function Page(props: { params: Promise<{ id: string }> }) {
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
                        {
                            label: 'Мониторинг запросов', href: '/monitoring'
                        },
                        {
                            label: 'Запросы пользователя',
                            href: `/monitoring/${id}/edit`,
                            active: true,
                        },
                    ]}
            />
            <UserQueriesPanel user={user} />
        </main>
    );
}