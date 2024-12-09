import { fetchUserByEmail } from "@/app/lib/data";
import { ErrorAccess } from "@/app/ui/error-access";
import Search from "@/app/ui/queries/search";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Page() {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return <ErrorAccess />;

    const user = await fetchUserByEmail(email);
    if (!user) return <ErrorAccess />;

    return (
        <div className="w-full flex flex-col items-center px-4">
            <div className="mt-10 text-2xl md:text-4xl font-semibold text-primarytxt">Добро пожаловать</div>
            <div className="text-md md:text-lg text-gray-600 mt-2 mb-10 leading-5 text-wrap indent-1">Вы можете начать поиск по ФИО, фотографии, email, номеру телефона, адресу и т.д.</div>
            <Search
                url={process.env.WS_URL || 'http://localhost:3001'}
                userId={user.id}
            />
        </div >
    );
}