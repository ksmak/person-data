import { ImportForm } from "@/app//ui/import/forms";

export default async function Page() {
    return (
        <div className="w-full">
            <h1 className="text-2xl text-center pb-5">Загрузка данных</h1>
            <ImportForm />
        </div>
    )
}