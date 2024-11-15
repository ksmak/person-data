import { ImportForm } from "../ui/import/form";
import { ImportPanel } from "../ui/import/panel";

export default async function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Загрузка данных</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <ImportForm />
            </div>
        </div>
    )
}