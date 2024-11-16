'use client';

import { ImportState, uploadFile } from "@/app/lib/actions";
import { Spinner } from "@material-tailwind/react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { HiOutlineUpload } from "react-icons/hi";

export function UploadFileButton({
    fileName
}: {
    fileName: string | undefined
}) {
    const [state, setState] = useState<ImportState>({});
    const refForm = useRef<HTMLFormElement>(null);
    const status = useFormStatus()

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            //const file = event.target.files[0];
            //const extension = file.name.split('.').at(-1);
            refForm.current?.requestSubmit();
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const initialState = { message: '', file: '' }
        setState(await uploadFile(initialState, formData));
    }

    const file = state.file ? state.file : fileName;

    return (
        <form onSubmit={handleSubmit} ref={refForm}>
            <div className="flex gap-5 items-center justify-self-start">
                <label htmlFor="uploadFile1"
                    className="w-48 flex gap-4 justify-center bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 items-center hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer mx-auto font-[sans-serif]">
                    {status.pending ? "Загрузка..." : "Выбрать файл"}
                    {status.pending ? <Spinner className="h-6 w-6" /> : <HiOutlineUpload className="h-6 w-6" />}
                    <input
                        className="hidden"
                        id="uploadFile1"
                        type="file"
                        name="file"
                        onChange={handleChange}
                    />
                </label>
                {file && <span>Выбран файл: {file}</span>}
            </div>
            <div className="text-red-600 p-2 text-sm">
                {state.message}
            </div>
        </form>
    );
}