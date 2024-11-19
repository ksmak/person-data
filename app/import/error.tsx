'use client';

import { useEffect } from 'react';
import { Btn } from '@/app/ui/buttons';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text-center">На страница произошла ошибка!</h2>
            <Btn
                onClick={
                    // Attempt to recover by trying to re-render the invoices route
                    () => reset()
                }
            >
                Повторить
            </Btn>
        </main>
    );
}