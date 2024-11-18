import { Person, PersonField } from "@/app/lib/definitions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ConfigTable({
    cols,
    personFields,
}: {
    cols: string[],
    personFields: PersonField[]
}) {
    return (
        <div className="grow-0 flex-col justify-center rounded-lg">
            <div className="font-bold uppercase text-center p-2 w-full mb-4 h-5 text-sm">Настройка</div>
            <div className="overflow-y-auto bg-gray-50">
                <table className="hidden min-w-full text-gray-900 md:table">
                    <thead className="block rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th
                                scope="col"
                                className="w-96 px-4 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Наименование столбца</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Соответствующее поле</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="block bg-white h-[20rem] overflow-auto">
                        {Array.isArray(cols) && cols.map((col: string, index: number) => (
                            <tr
                                key={index}
                                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:cursor-pointer hover:bg-gray-50"
                            >
                                <td className="whitespace-nowrap px-3 py-3">
                                    {col}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <select
                                        id={col}
                                        name={col}
                                        form="previewForm"
                                        defaultValue=""
                                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                                    >
                                        <option value=""></option>
                                        {personFields.map((fld: { name: string, title: string }, index: number) => (
                                            <option key={index} value={fld.name}>
                                                {fld.title}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function PersonsTable({
    persons
}: {
    persons: Person[]
}) {
    return (
        <div className="flex-col justify-center rounded-lg">
            <div className="font-bold uppercase text-center p-2 w-full mb-4 h-5 text-sm">Данные</div>
            <div className=" bg-gray-50">
                <table className="hidden min-w-full text-gray-900 md:table">
                    <thead className="block rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Фамилия</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Имя</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Отчество</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"

                            >
                                <div className="flex gap-3 items-center">
                                    <span>ИИН</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Номер телефона</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Область/Регион</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Район</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Населенный пункт</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Улица/Микрорайон</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Дом</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-5 font-medium hover:cursor-pointer"
                            >
                                <div className="flex gap-3 items-center">
                                    <span>Квартира</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="block bg-white h-[21rem] overflow-y-auto">
                        {persons?.map((person: Person, index: number) => (
                            <tr
                                key={index}
                                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:cursor-pointer hover:bg-gray-50"
                            >
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.lastName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.firstName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.middleName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.iin}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.phone}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.region}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.district}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.street}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.building}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {person.apartment}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}