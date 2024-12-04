import { Metadata } from "next";
import { auth } from "@/auth";
import { ErrorAccess } from "@/app/ui/error-access";
import ResultList from "@/app/ui/queries/result_list";
import { createQuery } from "@/app/lib/actions";
import { fetchUserByEmail } from "@/app/lib/data";
import Search from "@/app/ui/queries/search";
import { z, ZodError } from "zod";

export const metadata: Metadata = {
    title: 'Search',
};

export default async function Page(props: {
    searchParams?: Promise<{
        body?: string;
    }>;
}) {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);
    if (!user) return <ErrorAccess />;

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-xl md:text-4xl font-semibold text-primarytxt">Добро пожаловать</div>
            <div className="text-xs md:text-lg text-gray-600 mt-2 mb-10 leading-5 text-wrap indent-1">Вы можете начать поиск по ФИО, фотографии, ИИН/БИН, email, номеру телефона, адресу и т.д.</div>
            <div className="w-full">
                <Search />
            </div>
            <div className="w-full mt-3">
                <ResultList url={process.env.WS_URL || "http://localhost:3001"} userId={user.id} />
            </div>
        </div >
    );
}