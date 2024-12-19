import { fetchUserById } from "@/app/lib/data";
import { SecondaryBtn } from "@/app/ui/buttons";
import { ErrorAccess } from "@/app/ui/error-access";
import UserQueriesPanel from "@/app/ui/admin/monitoring/panels";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { auth } from "@/auth";
import Link from "next/link";
import { HiOutlineX } from "react-icons/hi";

export default async function Page(props: {
  params: Promise<{
    userId: string;
  }>;
  searchParams?: Promise<{
    page?: string;
    orderBy?: string;
    sort?: string;
  }>;
}) {
  const params = await props.params;
  const userId = params.userId;

  const user = await fetchUserById(userId);

  if (!user?.isAdmin) return <ErrorAccess />;

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const orderBy = searchParams?.orderBy || "createdAt";
  const sort = searchParams?.sort || "desc";

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Администрирование",
            href: "/dashboard/admin",
          },
          {
            label: "Мониторинг запросов",
            href: "/dashboard/admin/monitoring",
          },
          {
            label: "Запросы пользователя",
            href: `/dashboard/admin/monitoring/${userId}/edit`,
            active: true,
          },
        ]}
      />
      <div className="flex justify-end">
        <SecondaryBtn className="md:w-28 justify-center">
          <Link
            className="flex items-center gap-1"
            href={`/dashboard/admin/monitoring`}
          >
            <span className="hidden md:block">Закрыть</span>{" "}
            <HiOutlineX className="h-5 w-5" />
          </Link>
        </SecondaryBtn>
      </div>
      <UserQueriesPanel
        userId={userId}
        currentPage={currentPage}
        orderBy={orderBy}
        sort={sort}
      />
    </main>
  );
}
