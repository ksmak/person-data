'use client';

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { HiOutlineDownload, HiCloudUpload } from "react-icons/hi";
import Papa from 'papaparse';
import Panel from "./panel";
import { Person } from "@/app/lib/definitions";

export function ImportForm() {
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState<Person[]>([]);

    const streamPeopleCSV = (csvFile: File): void => {
        let persons: Person[] = [];
        const parset = Papa.parse<Person>(csvFile, {
            header: true,
            dynamicTyping: true,
            step: (results) => {
                console.log("Row data:", results.data);
                persons.push(results.data);
            }
        });

        setData(persons);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            streamPeopleCSV(file);
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start">
            <div className="flex gap-4 items-center">
                <label htmlFor="uploadFile1"
                    className="w-48 flex gap-4 justify-center bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 items-center hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer mx-auto font-[sans-serif]">
                    Выбрать файл
                    <HiCloudUpload className="h-6 w-6" />
                    <input type="file" id='uploadFile1' className="hidden" onChange={handleChange} />
                </label>
            </div>
            <div className="mt-5 flex w-full justify-center rounded-lg bg-gray-50 p-2 md:pt-0">
                {data && <Panel data={data} />}
            </div>
            <div className="mt-5 flex gap-4 items-center">
                {data && <button
                    className="w-48 flex gap-4 justify-center bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 items-center hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer mx-auto font-[sans-serif]"
                    type="submit"
                >Начать загрузку <HiOutlineDownload className="h-6 w-6" /></button>}
            </div>
        </form>
    )
} 