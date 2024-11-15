'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { Person, PersonField } from "@/app/lib/definitions";
import { importData } from "@/app/lib/actions";
import Papa from 'papaparse';
import { ConfigTable } from "./tables";
import { JournalPanel } from "./panels";
import { UploadFileButton } from "./buttons";

export function ImportForm() {
    const [uploading, setUploading] = useState(false);
    const [persons, setPersons] = useState<Person[]>([]);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [cols, setCols] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string | undefined>();

    const personFields: PersonField[] = [
        { name: "fullName", title: "ФИО" },
        { name: "lastName", title: "Фамилия" },
        { name: "firstName", title: "Имя" },
        { name: "middleName", title: "Отчество" },
        { name: "iin", title: "ИИН" },
        { name: "phone", title: "Номер телефона" },
        { name: "region", title: "Область" },
        { name: "district", title: "Район" },
        { name: "locality", title: "Населенный пункт" },
        { name: "street", title: "Улица" },
        { name: "building", title: "Дом" },
        { name: "apartment", title: "Квартира" },
    ];

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
        <div className="w-full h-screen flex flex-col items-start">
            <div className="mt-5 font-medium text-red-600">
                {error}
            </div>
            <UploadFileButton uploading={uploading} fileName={fileName} />
            <div className="mt-5 w-full h-full flex justify-between gap-5">
                <ConfigTable cols={cols} personFields={personFields} />
                <JournalPanel logs={logs} />
            </div>
        </div>
    )
} 