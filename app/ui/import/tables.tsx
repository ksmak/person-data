import { PersonField } from "@/app/lib/definitions";

export function ConfigTable({
    cols,
    personFields,
}: {
    cols: string[],
    personFields: PersonField[],
}) {

    return (
        <div>
            <div className="font-bold uppercase text-center p-2 w-full mb-4 h-5 text-sm">Настройка</div>
            <div className="overflow-y-auto bg-select">
                <table className="min-w-full text-gray-900 md:table border border-gray-100">
                    <thead className="block rounded-lg text-left text-sm font-normal[&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg">
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
                                <div className="flex gap-3 items-center ">
                                    <span>Соответствующее поле</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="block bg-white">
                        {Array.isArray(cols) && cols.map((col: string, index: number) => (
                            <tr
                                key={index}
                                className="flex justify-between border-b md:py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:cursor-pointer hover:bg-secondary"
                            >
                                <td className="whitespace-nowrap px-3 py-3">
                                    {col}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <select
                                        id={col}
                                        form="previewForm"
                                        name={col}
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
};