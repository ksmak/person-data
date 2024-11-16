import { ImportForm } from "@/app//ui/import/forms";

export default async function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Загрузка данных</h1>
            </div>
            <ImportForm />
        </div>
    )
}