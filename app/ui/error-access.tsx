import { HiOutlineLockClosed } from "react-icons/hi";

export function ErrorAccess() {
    return (
        <div className="flex justify-center items-center gap-5">
            <div className="mt-32 border rounded-lg border-gray-200 bg-secondary p-10 flex flex-col items-center gap-10">
                <p className="text-2xl font-bold">Доступ запрещен!</p>
                <HiOutlineLockClosed className="h-16 w-16 text-red-600" />
                <p className="text-md font-medium">Для получения доступа обратитесь к администратору системы</p>
            </div>
        </div>
    )
}