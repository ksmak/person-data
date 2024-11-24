import { Btn } from '@/app/ui/buttons';
import Link from 'next/link';
import { HiOutlineEmojiSad } from "react-icons/hi";

export default function NotFound() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <HiOutlineEmojiSad className="w-10 text-gray-400" />
            <h2 className="text-xl font-semibold">404 Ошибка!</h2>
            <p>Пользователь не найден.</p>
            <Btn>
                <Link
                    href="/dashboard/monitoring"
                >
                    Назад
                </Link>
            </Btn>
        </main>
    );
}