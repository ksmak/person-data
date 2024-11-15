'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { HiOutlineDownload, HiCloudUpload } from "react-icons/hi";
import { Person } from "@/app/lib/definitions";
import { importData } from "@/app/lib/actions";
import { Spinner } from "@material-tailwind/react";
import Papa from 'papaparse';

export function ImportForm() {
    const [uploading, setUploading] = useState(false);
    const [persons, setPersons] = useState<Person[]>([]);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [cols, setCols] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const personFields = [
        { name: 'fullName', title: 'ФИО' },
        { name: 'lastName', title: 'Фамилия' },
        { name: 'firstName', title: 'Имя' },
        { name: 'middleName', title: 'Отчество' },
        { name: 'iin', title: 'ИИН' },
        { name: 'phone', title: 'Номер телефона' },
        { name: 'region', title: 'Область' },
        { name: 'district', title: 'Район' },
        { name: 'locality', title: 'Населенный пункт' },
        { name: 'street', title: 'Улица' },
        { name: 'building', title: 'Дом' },
        { name: 'apartment', title: 'Квартира' },
    ]

    type ParsedData = {
        persons: Person[],
        cols: string[],
    }

    async function uploadCsv(csvFile: File, formData: FormData | undefined = undefined): Promise<ParsedData> {
        let persons: Person[] = [];
        let cols: string[] = [];

        return new Promise(resolve => {
            Papa.parse<any>(csvFile, {
                header: true,
                dynamicTyping: true,
                step: (results) => {
                    cols = results.meta.fields ? results.meta.fields : [];
                    if (formData) {
                        let person: Person = {};
                        results.meta.fields?.forEach(element => {
                            const field = formData.get(`${element}`);
                            const val = results.data[`${element}` as keyof typeof results.data];
                            if (field && val) {
                                person[`${field}` as keyof typeof person] = val;
                            }
                        });
                        persons.push(person);
                        setLogs(prev => prev.concat([`Добавлена запись: ${JSON.stringify(person)}`]));
                    } else {
                        setLogs(prev => prev.concat([`Строка: ${JSON.stringify(results.data)}`]));
                    }
                },
                complete: (results) => {
                    resolve({ persons: persons, cols: cols });
                }
            });
        });
    }

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        setError('');
        setPersons([]);
        setLogs([]);
        setCols([]);
        setFile(null);
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            const extension = file.name.split('.').at(-1);
            switch (extension) {
                case 'csv': {
                    setLogs(prev => prev.concat([`Начат процес предварительной обработки ${file.name}...`]));
                    const parseData = await uploadCsv(file);
                    setLogs(prev => prev.concat([`Предварительная обработка завершена`]));
                    setFile(file);
                    setCols(parseData.cols);
                    break;
                }
                default: {
                    setError('Неверный формат файла.');
                    setFile(null);
                }
            }
        }
        setUploading(false);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!file) {
            setError('Ошибка! Файл не выбран!');
            return;
        }
        setUploading(true);
        setError('');
        setPersons([]);
        setLogs([]);

        const formData = new FormData(event.currentTarget);
        setLogs(prev => prev.concat([`Начат процес предварительной обработки ${file.name}...`]));
        const parseData = await uploadCsv(file, formData);
        setLogs(prev => prev.concat([`Предварительная обработка завершена`]));

        console.log(parseData);
        setLogs(prev => prev.concat([`Начат процес загрузки данных ...`]));
        await importData(undefined, formData);
        setLogs(prev => prev.concat([`Загрузка данных завершена.`]));
        setUploading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="w-full h-screen flex flex-col items-start">
            <div className="flex gap-4 items-center">
                <label htmlFor="uploadFile1"
                    className="w-48 flex gap-4 justify-center bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 items-center hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer mx-auto font-[sans-serif]">
                    {uploading ? "Загрузка..." : "Выбрать файл"}
                    {uploading ? <Spinner className="h-6 w-6" /> : <HiCloudUpload className="h-6 w-6" />}
                    <input type="file" id='uploadFile1' name="file" className="hidden" onChange={handleChange} disabled={uploading} />
                </label>
                {file && <span>Выбран файл: {file?.name}</span>}
            </div>
            <div className="mt-5 font-medium text-red-600">
                {error}
            </div>
            <div className="mt-5 flex gap-4 items-center">
                {file && <button
                    className="w-48 flex gap-4 justify-center bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 items-center hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer mx-auto font-[sans-serif]"
                    type="submit"
                    disabled={uploading}
                >
                    {uploading ? "Загрузка..." : "Начать загрузку"}
                    {uploading ? <Spinner className="h-6 w-6" /> : <HiOutlineDownload className="h-6 w-6" />}
                </button>}
            </div>
            <div className="mt-5 w-full h-full flex justify-between gap-5">
                <div className="shrink flex-col justify-center rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="font-bold uppercase text-center p-2 w-full mb-4 h-5 text-sm">Настройка</div>
                    {cols.length > 0 && <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
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
                        <tbody className="bg-white">
                            {cols?.map((col: string, index: number) => (
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
                                            defaultValue=""
                                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                                        >
                                            <option value="" disabled></option>
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
                    </table>}
                </div>
                <div className="grow flex-col justify-center rounded-lg bg-gray-50 p-2 md:pt-0 overflow-auto">
                    <div className="font-bold uppercase text-center p-2 w-full mb-4 h-5 text-sm">Журнал</div>
                    {logs.map((log: string, index: number) => (
                        <div key={index} className="text-xs">{log}</div>
                    ))}
                </div>
            </div>
        </form>
    )
} 