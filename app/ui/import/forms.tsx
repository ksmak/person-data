'use client';

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Spinner, Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { HiOutlineUpload, HiOutlineDatabase, HiOutlineCog } from "react-icons/hi";
import { ImportState, loadData, previewData, uploadFile } from "@/app/lib/actions";
import { ConfigTable, PersonsTable } from "@/app/ui/import/tables";
import { JournalPanel } from "@/app/ui/import/panels";
import { PersonField } from "@/app/lib/definitions";

export function ImportForm() {
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadState, setUploadState] = useState<ImportState>({});
    const [previewState, setPreviewState] = useState<ImportState>({});
    const [loadState, setLoadState] = useState<ImportState>({});
    const refForm = useRef<HTMLFormElement>(null);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

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
        setUploadState(await uploadFile({}, formData));
        setUploading(false);
    }

    const handlePreviewData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPreviewing(true);
        const formData = new FormData(event.currentTarget);
        const previewDataWithParams = previewData.bind(null, {
            fileName: uploadState.file,
            cols: uploadState.cols || []
        });
        setPreviewState(await previewDataWithParams({}, formData));
        setPreviewing(false);
    }

    const handleLoadData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const loadDataWithParams = loadData.bind(null, {
            fileName: previewState.file,
            cols: previewState.cols || [],
            persons: previewState.persons || []
        });
        setLoadState(await loadDataWithParams({}));
        setLoading(false);
    }

    return (
        <div className="w-full h-dvh">
            <div className="w-full px-24 py-4">
                <Stepper
                    activeStep={activeStep}
                    className=""
                    lineClassName="bg-blue-200"
                    activeLineClassName="bg-blue-600"
                    isLastStep={(value) => setIsLastStep(value)}
                    isFirstStep={(value) => setIsFirstStep(value)}
                >
                    <Step
                        className=""
                        activeClassName="ring-0 !bg-blue-600 text-white"
                        completedClassName="ring-0 !bg-blue-600 text-white"
                        onClick={() => setActiveStep(0)}
                    >
                        <HiOutlineUpload className="h-5 w-5" />
                        <div className="absolute -bottom-[4.5rem] w-max text-center">
                            <Typography
                                variant="h6"
                                color="gray"
                            >
                                Этап 1
                            </Typography>
                            <Typography
                                className="font-normal"
                                color="gray"
                            >
                                Выбор файла
                            </Typography>
                        </div>
                    </Step>
                    <Step
                        className=""
                        activeClassName="ring-0 !bg-blue-600 text-white"
                        completedClassName="ring-0 !bg-blue-600 text-white"
                        onClick={() => setActiveStep(1)}
                    >
                        <HiOutlineCog className="h-5 w-5" />
                        <div className="absolute -bottom-[4.5rem] w-max text-center">
                            <Typography
                                variant="h6"
                                color="gray"
                            >
                                Этап 2
                            </Typography>
                            <Typography
                                color="gray"
                                className="font-normal"
                            >
                                Подготовка данных для загрузки.
                            </Typography>
                        </div>
                    </Step>
                    <Step
                        className=""
                        activeClassName="ring-0 !bg-blue-600 text-white"
                        completedClassName="ring-0 !bg-blue-600 text-white"
                        onClick={() => setActiveStep(2)}
                    >
                        <HiOutlineDatabase className="h-5 w-5" />
                        <div className="absolute -bottom-[4.5rem] w-max text-center">
                            <Typography
                                variant="h6"
                                color="gray"
                            >
                                Этап 3
                            </Typography>
                            <Typography
                                color="gray"
                                className="font-normal"
                            >
                                Загрузка данных в базу данных.
                            </Typography>
                        </div>
                    </Step>
                </Stepper>
            </div>
            {activeStep === 0 && <div className="w-full mt-[4rem]">
                <div className="rounded-lg h-24 w-full flex flex-col gap-3 justify-center items-center">
                    <form id="uploadForm" onSubmit={handleUploadFile} ref={refForm}>
                        <div className="w-full flex justify-start items-center gap-5">
                            <label htmlFor="uploadFile1"
                                className="flex justify-start items-center gap-4 bg-gradient-to-t font-bold text-xs uppercase from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-300 text-white px-4 py-2 outline-none rounded-lg cursor-pointer font-[sans-serif]"
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
                            {uploadState.file && <span className="italic text-gray-600">Выбран файл: {uploadState.file}</span>}
                        </div>
                    </form>
                    <div className="text-red-600 text-sm">
                        {uploadState.error}
                    </div>
                </div>
                <div className="rounded h-full w-full">
                    <JournalPanel logs={uploadState.logs || []} />
                </div>
            </div>}
            {activeStep === 1 && <div className="w-full mt-[4rem]">
                <div className="rounded-lg h-24 w-full flex flex-col gap-3 justify-center items-center">
                    <form id="previewForm" onSubmit={handlePreviewData}>
                        <div className="flex gap-4 items-center">
                            {uploadState.file && <Button
                                type="submit"
                                variant="gradient"
                                color="blue"
                                size="md"
                                className="flex gap-4 items-center"
                            >
                                {previewing ? "Обработка данных..." : "Подготовить данные"}
                                {previewing ? <Spinner className="h-6 w-6" /> : <HiOutlineCog className="h-6 w-6" />}
                            </Button>}
                            {previewState.persons && <span className="italic text-gray-600">Данные подготовлены</span>}
                        </div>
                    </form>
                    <div className="text-red-600 text-sm">
                        {previewState.error}
                    </div>
                </div>
                <div className="rounded h-full w-full">
                    {uploadState.file && <div className="mt-5 w-full flex justify-between gap-5">
                        <ConfigTable cols={uploadState.cols || []} personFields={personFields} />
                        <JournalPanel logs={previewState.logs || []} />
                    </div>}
                </div>
            </div>}
            {activeStep === 2 && <div className="w-full mt-[4rem]">
                <div className="rounded-lg h-24 w-full flex flex-col gap-3 justify-center items-center">
                    <form onSubmit={handleLoadData}>
                        <div className="flex gap-4 items-center">
                            {previewState.persons && <Button
                                type="submit"
                                variant="gradient"
                                color="blue"
                                size="md"
                                className="flex gap-4 items-center"
                            >
                                {loading ? "Загрузка данных..." : "Загрузить данных"}
                                {loading ? <Spinner className="h-6 w-6" /> : <HiOutlineDatabase className="h-6 w-6" />}
                            </Button>}
                            {loadState.persons && <span className="italic text-gray-600">Данные загружены</span>}
                        </div>
                    </form>
                    <div className="text-red-600 text-sm">
                        {loadState.error}
                    </div>
                </div>
                <div className="w-full">
                    {loadState.persons && <PersonsTable persons={loadState.persons || []} />}
                </div>
            </div>}
            <div className="mt-5 flex justify-between">
                <Button onClick={handlePrev} disabled={isFirstStep} variant="gradient" color="blue">
                    Предыдущий этап
                </Button>
                <Button onClick={handleNext} disabled={isLastStep} variant="gradient" color="blue">
                    Следующий этап
                </Button>
            </div>
        </div>
    );
} 