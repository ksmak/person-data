import { Result } from "@/app/lib/definitions";

export default function ErrorCard({ result }: { result: Result }) {
    return (
        <div className='w-full p-2 bg-secondary rounded my-3 border border-borderlight text-sm text-red-600'>
            <div>Сервис: {result.service},</div>
            <div>{result.error}</div>
        </div>
    );
};