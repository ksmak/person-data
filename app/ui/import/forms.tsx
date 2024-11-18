'use client';

import Papa from "papaparse";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Spinner, Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { HiOutlineUpload, HiOutlineDatabase, HiOutlineCog } from "react-icons/hi";
import { ImportState, loadData, previewData, uploadFile } from "@/app/lib/actions";
import { ConfigTable, PersonsTable } from "@/app/ui/import/tables";
import { JournalPanel } from "@/app/ui/import/panels";
import { Person, PersonField, personFields } from "@/app/lib/definitions";
import prisma from "@/app/lib/db";

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
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [cols, setCols] = useState<string[]>([]);
    const [uploadLogs, setUploadLogs] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string>('');
    const [persons, setPersons] = useState<Person[] | null>();
    const [previewLogs, setPreviewLogs] = useState<string[]>([]);
    const [previewError, setPreviewError] = useState<string>('');

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        setUploadError('');
        setUploadLogs([]);
        setCols([]);
        setFile(null);
        if (event.target.files && event.target.files.length) {
            // refForm.current?.requestSubmit();
            const file = event.target.files[0];
            const extension = file.name.split(".").at(-1);
            setFile(file);
            //check
            if (extension !== "csv" && extension !== "txt") {
                setUploadError("Ошибка формата файла! Для загрузки данных необходимы файлы с расширением csv, txt");
                return;
            }
            let data: any[] = []
            let cols: string[] = [];
            let count = 0;
            const limitRows = 1000;
            setUploadLogs(prev => prev.concat([`Начат процесс предварительной загрузки файла ${file.name}...`]));
            Papa.parse<any>(file, {
                header: true,
                dynamicTyping: true,
                step: (results, parser) => {
                    count++;
                    cols = results.meta.fields ? results.meta.fields : [];
                    data.push(results.data);
                    setUploadLogs(prev => prev.concat([`Запись: ${JSON.stringify(results.data)}`]));
                    //limit rows
                    if (limitRows === count) {
                        parser.abort();
                    }
                },
                complete: (results) => {
                    setCols(cols);
                    setData(data);
                    setUploadLogs(prev => prev.concat([`Процесс загрузки файла завершен...`]));
                },
            });
        }
        setUploading(false);
    };

    const handleUploadFile = async (event: FormEvent<HTMLFormElement>) => {
        // event.preventDefault();
        // setUploading(true);
        // const formData = new FormData(event.currentTarget);
        // setUploadState(await uploadFile({}, formData));
        // setUploading(false);
    }

    const handlePreviewData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPreviewing(true);
        setPreviewError('');
        setPreviewLogs([]);
        setPersons([]);
        setPreviewLogs(prev => prev.concat([`Начат процесс обработки данных файла ${file?.name}...`]));
        const formData = new FormData(event.currentTarget);
        //get select cols
        let config: PersonField[] = [];
        cols.forEach((item: string) => {
            const field = formData.get(item);
            if (field) {
                config.push({
                    name: item,
                    title: item,
                    value: field,
                } as PersonField);
            }
        });
        console.log(data);
        //load data into persons
        data.map((item: any) => {
            let person: Person = {};
            config.forEach((conf: PersonField) => {
                const val =
                    item[`${conf.name}` as keyof typeof item];
                if (val) {
                    person[`${conf.value}` as keyof typeof person] = val;
                }
            });
            setPersons(prev => prev.concat([person]));
            setPreviewLogs(prev => prev.concat([`Запись: ${JSON.stringify(person)}.`]));
        })
        setPreviewLogs(prev => prev.concat([`Процесс обработки данных завершен.`]));
        // const previewDataWithParams = previewData.bind(null, {
        //     fileName: uploadState.file,
        //     cols: uploadState.cols || []
        // });
        // setPreviewState(await previewDataWithParams({}, formData));
        setPreviewing(false);
    }

    const handleLoadData = async (event: FormEvent<HTMLFormElement>) => {
        setLoadState({});
        event.preventDefault();
        setLoading(true);
        const loadDataWithParams = loadData.bind(null, persons || []);
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
                            {file && <span className="italic text-gray-600">Выбран файл: {file.name}</span>}
                        </div>
                    </form>
                    <div className="text-red-600 text-sm">
                        {uploadError}
                    </div>
                </div>
                <div className="rounded h-full w-full">
                    <JournalPanel logs={uploadLogs} />
                </div>
            </div>}
            {activeStep === 1 && <div className="w-full mt-[4rem]">
                <div className="rounded-lg h-24 w-full flex flex-col gap-3 justify-center items-center">
                    <form id="previewForm" onSubmit={handlePreviewData}>
                        <div className="flex gap-4 items-center">
                            {file && <Button
                                type="submit"
                                variant="gradient"
                                color="blue"
                                size="md"
                                className="flex gap-4 items-center"
                            >
                                {previewing ? "Обработка данных..." : "Подготовить данные"}
                                {previewing ? <Spinner className="h-6 w-6" /> : <HiOutlineCog className="h-6 w-6" />}
                            </Button>}
                            {persons && <span className="italic text-gray-600">Данные подготовлены</span>}
                        </div>
                    </form>
                    <div className="text-red-600 text-sm">
                        {previewError}
                    </div>
                </div>
                <div className="rounded h-full w-full">
                    {file && <div className="mt-5 w-full flex justify-between gap-5">
                        <ConfigTable cols={cols} personFields={personFields} />
                        <JournalPanel logs={previewLogs} />
                    </div>}
                </div>
            </div>}
            {activeStep === 2 && <div className="w-full mt-[4rem]">
                <div className="rounded-lg h-24 w-full flex flex-col gap-3 justify-center items-center">
                    <form onSubmit={handleLoadData}>
                        <div className="flex gap-4 items-center">
                            {persons && <Button
                                type="submit"
                                variant="gradient"
                                color="blue"
                                size="md"
                                className="flex gap-4 items-center"
                            >
                                {loading ? "Загрузка данных..." : "Загрузить данных"}
                                {loading ? <Spinner className="h-6 w-6" /> : <HiOutlineDatabase className="h-6 w-6" />}
                            </Button>}
                            {loadState?.persons && <span className="italic text-gray-600">Данные загружены</span>}
                        </div>
                    </form>
                    <div className="text-red-600 text-sm">
                        {loadState?.error}
                    </div>
                </div>
                <div className="w-full h-full rounded">
                    {loadState?.logs && <JournalPanel logs={loadState?.logs || []} />}
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