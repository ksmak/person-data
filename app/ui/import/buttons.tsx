'use client';

import { uploadFile } from "@/app/lib/actions";
import { Spinner } from "@material-tailwind/react";
import { ChangeEvent, FormEvent, useRef } from "react";
import { HiOutlineUpload } from "react-icons/hi";

export function UploadFileButton({
    uploading,
    fileName,
}: {
    uploading: boolean,
    fileName: string | undefined
}) {
    const refForm = useRef<HTMLFormElement>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            //const file = event.target.files[0];
            //const extension = file.name.split('.').at(-1);
            refForm.current?.requestSubmit();
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        await uploadFile(formData);
    }

    return (
        <div className="flex gap-4 items-center">
            <form onSubmit={handleSubmit} ref={refForm}>
                <label htmlFor="uploadFile1"
                    className="w-48 flex gap-4 justify-center bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 items-center hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer mx-auto font-[sans-serif]">
                    {uploading ? "Загрузка..." : "Выбрать файл"}
                    {uploading ? <Spinner className="h-6 w-6" /> : <HiOutlineUpload className="h-6 w-6" />}
                    <input
                        className="hidden"
                        id="uploadFile1"
                        type="file"
                        name="file"
                        onChange={handleChange}
                    />
                </label>
                {fileName && <span>Выбран файл: {fileName}</span>}
            </form>
        </div>
    );
}