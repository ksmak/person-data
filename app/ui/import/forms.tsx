'use client';

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Spinner } from "@material-tailwind/react";
import { HiOutlineUpload } from "react-icons/hi";
import { ImportState, loadData, previewData, uploadFile } from "@/app/lib/actions";
import { ConfigTable } from "@/app/ui/import/tables";
import { JournalPanel } from "@/app/ui/import/panels";
import { PersonField } from "@/app/lib/definitions";

export function ImportForm() {
    const [uploading, setUploading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<ImportState>({});
    const refForm = useRef<HTMLFormElement>(null);

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

    const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            refForm.current?.requestSubmit();
        }
    };

    const handleUploadFile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUploading(true);
        const formData = new FormData(event.currentTarget);
        setState(await uploadFile({}, formData));
        setUploading(false);
    }

    const handlePreviewData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPreviewing(true);
        const formData = new FormData(event.currentTarget);
        const previewDataWithParams = previewData.bind(null, { fileName: state.file, cols: state.cols || [] });
        setState(await previewDataWithParams({}, formData));
        setPreviewing(false);
    }

    const handleLoadData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const loadDataWithParams = loadData.bind(null, { fileName: state.file, cols: state.cols || [], persons: state.persons || [] });
        setState(await loadDataWithParams({}));
        setLoading(false);
    }


    return (
        <div className="w-full h-screen">
            <form id="uploadForm" onSubmit={handleUploadFile} ref={refForm}>
                <div className="w-full mb-4 flex justify-start items-center gap-5">
                    <label htmlFor="uploadFile1"
                        className="flex justify-start items-center gap-4  bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer font-[sans-serif]"
                    >
                        {uploading ? "Загрузка файла..." : "Выбрать файл"}
                        {uploading ? <Spinner className="h-6 w-6" /> : <HiOutlineUpload className="h-6 w-6" />}
                        <input
                            className="hidden"
                            id="uploadFile1"
                            type="file"
                            name="file"
                            onChange={handleSelectFile}
                        />
                    </label>
                    {state.file && <span>Выбран файл: {state.file}</span>}
                </div>
                <div className="text-red-600 p-2 text-sm">
                    {state.error}
                </div>
            </form>
            <form id="previewForm" onSubmit={handlePreviewData}>
                <div className="flex gap-4 items-center">
                    {state.file && <button
                        className="flex justify-start items-center gap-4 bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer font-[sans-serif]"
                        type="submit"
                    >
                        {previewing ? "Загрузка данных..." : "Подготовка данных к загрузке"}
                        {previewing ? <Spinner className="h-6 w-6" /> : <HiOutlineUpload className="h-6 w-6" />}
                    </button>}
                    {state.persons && <span>Данные подготовлены</span>}
                </div>
            </form>
            <div className="mt-10">
                <form onSubmit={handleLoadData}>
                    {state.persons && <button
                        className="flex justify-start items-center gap-4 bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer font-[sans-serif]"
                        type="submit"
                    >
                        {loading ? "Загрузка данных..." : "Загрузка данных"}
                        {loading ? <Spinner className="h-6 w-6" /> : <HiOutlineUpload className="h-6 w-6" />}
                    </button>}
                </form>
            </div>
            <div className="w-full mt-4 flex items-center justify-between gap-2 md:mt-8">
                <div className="mt-5 w-full flex justify-between gap-5">
                    <ConfigTable cols={state.cols || []} personFields={personFields} />
                    <JournalPanel logs={state.logs || []} />
                </div>
            </div>
        </div>
    )
} 