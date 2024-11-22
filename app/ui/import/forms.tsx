'use client';

import Papa from "papaparse";
import io from 'socket.io-client';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Spinner, Stepper, Step, Typography } from "@material-tailwind/react";
import { HiChevronLeft, HiChevronRight, HiOutlineUpload, HiOutlineDatabase, HiOutlineCog } from "react-icons/hi";
import { ImportState, loadData } from "@/app/lib/actions";
import { ConfigTable } from "@/app/ui/import/tables";
import { JournalPanel } from "@/app/ui/import/panels";
import { Person, PersonField, personFields } from "@/app/lib/definitions";
import { Btn } from "@/app/ui/buttons";
import { formatPhone, formatStr } from "@/app/lib/utils";
import { Db } from "@prisma/client";

const LIMIT_ROW_COUNT = 100

export function ImportForm({ url, db }: { url: string, db: Db[] }) {
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadState, setLoadState] = useState<ImportState>({});
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [cols, setCols] = useState<string[]>([]);
    const [uploadLogs, setUploadLogs] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string>('');
    const [persons, setPersons] = useState<Person[]>([]);
    const [previewLogs, setPreviewLogs] = useState<string[]>([]);
    const [previewError, setPreviewError] = useState<string>('');
    const [dbId, setDbId] = useState<string>(db[0].id);

    const refForm = useRef<HTMLFormElement>(null);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        setUploadError('');
        setUploadLogs([]);
        setCols([]);
        setFile(null);
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            const extension = file.name.split(".").at(-1);
            setFile(file);
            if (extension !== "csv") {
                setUploadError("Ошибка формата файла! Для загрузки данных необходимы файлы с расширением csv");
                setUploading(false);
                return;
            }
            let data: any[] = []
            let cols: string[] = [];
            let count = 0;
            const limitRows = LIMIT_ROW_COUNT;
            setUploadLogs(prev => prev.concat(['[']));
            Papa.parse<any>(file, {
                header: true,
                dynamicTyping: true,
                step: (results, parser) => {
                    count++;
                    cols = results.meta.fields ? results.meta.fields : [];
                    data.push(results.data);
                    setUploadLogs(prev => prev.concat(`${[JSON.stringify(results.data, null, 2)]},`));
                    //limit rows
                    if (limitRows === count) {
                        parser.abort();
                    }
                },
                complete: () => {
                    setUploadLogs(prev => prev.concat([']']));
                    setCols(cols);
                    setData(data);
                },
            });
        }
        setUploading(false);
    };

    const handlePreviewData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPreviewing(true);
        setPreviewError('');
        setPreviewLogs([]);
        setPersons([]);
        const formData = new FormData(event.currentTarget);
        //get select cols
        let conf: PersonField[] = [];
        cols.forEach((item: string) => {
            const field = formData.get(item);
            if (field) {
                conf.push({
                    name: item,
                    title: item,
                    value: field,
                } as PersonField);
            }
        });
        //load data into persons
        data.map((item: any) => {
            let person: Person = {
                dbId: dbId,
                extendedPersonData: {},
            };
            Object.keys(item).map((key: string) => {
                const val = item[key];
                if (val) {
                    let existFlag = false;
                    conf.forEach((conf: PersonField) => {
                        if (key === conf.name) {
                            existFlag = true;
                            const formatVal = (conf.name === 'phone')
                                ? formatPhone(val)
                                : formatStr(val);
                            if (conf.value) {
                                person[`${conf.value}` as keyof typeof person] = formatVal;
                            }
                        }
                    });
                    if (!existFlag) {
                        person.extendedPersonData ? person.extendedPersonData[`${key}`] = formatStr(val) : null;
                    }
                }
            })
            setPersons(prev => prev.concat([person]));
            setPreviewLogs(prev => prev.concat([JSON.stringify(person, null, 2)]));
        })
        setPreviewing(false);
    }

    const handleLoadData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setLoadState({});
        try {
            await loadData(persons);
        } catch (e) {
            setLoadState({ ...loadState, error: String(e) })
        }
    };

    useEffect(() => {
        const socket = io(url);

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('load-completed', (loadState: ImportState) => {
            console.log('load data completed');
            setLoadState(loadState);
            setLoading(false);
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="w-full h-dvh">
            <div className="w-full px-24 py-2">
                <Stepper
                    activeStep={activeStep}
                    className=""
                    lineClassName="bg-gray-100"
                    activeLineClassName="bg-primary"
                    isLastStep={(value) => setIsLastStep(value)}
                    isFirstStep={(value) => setIsFirstStep(value)}
                >
                    <Step
                        className=""
                        activeClassName="ring-0 !bg-primary text-white"
                        completedClassName="ring-0 !bg-primary text-white"
                        onClick={() => setActiveStep(0)}
                    >
                        <HiOutlineUpload className="h-5 w-5" />
                        <div className="hidden md:block md:absolute md:-bottom-[4.5rem] md:w-max md:text-center">
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
                        activeClassName="ring-0 !bg-primary text-white"
                        completedClassName="ring-0 !bg-primary text-white"
                        onClick={() => setActiveStep(1)}
                    >
                        <HiOutlineCog className="h-5 w-5" />
                        <div className="hidden md:block md:absolute md:-bottom-[4.5rem] md:w-max md:text-center">
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
                        activeClassName="ring-0 !bg-primary text-white"
                        completedClassName="ring-0 !bg-primary text-white"
                        onClick={() => setActiveStep(2)}
                    >
                        <HiOutlineDatabase className="h-5 w-5" />
                        <div className="hidden md:block md:absolute md:-bottom-[4.5rem] md:w-max md:text-center">
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
                                Загрузка данных в базу.
                            </Typography>
                        </div>
                    </Step>
                </Stepper>
            </div>
            <div className="md:mt-[4.5rem] flex justify-between">
                <Btn onClick={handlePrev} disabled={isFirstStep}>
                    <HiChevronLeft className="h-4 w-4" />
                    <span className="hidden md:block">Предыдущий этап</span>
                </Btn>
                <Btn onClick={handleNext} disabled={isLastStep}>
                    <span className="hidden md:block">Следующий этап</span>
                    <HiChevronRight className="h-4 w-4" />
                </Btn>
            </div>
            <div className="w-full mt-5">
                {
                    activeStep === 0 && <form id="uploadForm" ref={refForm}>
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="w-full md:w-96">
                                <label htmlFor="db" className="text-sm font-medium">Наименование БД:</label>
                                <select id="db" className="text-sm p-2 border rounded w-full outline-none "
                                    value={dbId} onChange={e => setDbId(e.target.value)}>
                                    {db && db.length > 0 && db?.map((it: Db) => (<option key={it.id} value={it.id}>{it.name}</option>))}
                                </select>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="uploadFile1"
                                    className='w-fit flex items-center gap-3 rounded-lg p-2 text-xs  text-white uppercase bg-gradient-to-t from-emerald-500 to-emerald-400 hover:shadow-lg hover:shadow-emerald-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:bg-emerald-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
                                >
                                    {uploading ? "Загрузка файла..." : "Выбрать файл"}
                                    {uploading ? <Spinner className="h-5 w-5" /> : <HiOutlineUpload className="h-5 w-5" />}
                                    <input
                                        className="hidden"
                                        id="uploadFile1"
                                        type="file"
                                        name="file"
                                        onChange={handleSelectFile}
                                    />
                                </label>
                                {file && <span className="text-sm mt-4 italic text-gray-600">Выбран файл: {file.name}</span>}

                                <div className="mt-4 text-red-600 text-sm">
                                    {uploadError}
                                </div>
                                <div className="mt-2 text-sm italic underline hover:cursor-pointer">{uploadLogs.length > 0 && 'Смотреть журнал'}</div>
                            </div>
                        </div>
                    </form>}
                {
                    activeStep === 1 && <form id="previewForm" onSubmit={handlePreviewData}>
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="flex flex-col">
                                {file && <Btn
                                    type="submit"
                                    className="flex gap-4 items-center"
                                >
                                    {previewing ? "Обработка данных..." : "Подготовить данные"}
                                    {previewing ? <Spinner className="h-5 w-5" /> : <HiOutlineCog className="h-5 w-5" />}
                                </Btn>}
                                {persons.length > 0 && <span className="self-center italic text-gray-600">Данные подготовлены</span>}
                                <div className="mt-2 self-center text-sm italic underline hover:cursor-pointer">{previewLogs.length > 0 && 'Смотреть журнал'}</div>
                                <div className="self-center text-red-600 text-sm">
                                    {previewError}
                                </div>
                            </div>
                            <div className="mt-4 w-full md:w-fit">
                                {file && <ConfigTable cols={cols} personFields={personFields} />}
                            </div>
                        </div>
                    </form>
                }
                {
                    activeStep === 2 && <form id="loadForm" onSubmit={handleLoadData}>
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="flex flex-col justify-center">
                                {persons.length > 0 && <Btn
                                    type="submit"
                                    className="flex gap-4 items-center"
                                >
                                    {loading ? "Загрузка данных..." : "Загрузить данные"}
                                    {loading ? <Spinner className="h-5 w-5" /> : <HiOutlineDatabase className="h-5 w-5" />}
                                </Btn>}
                                {loadState?.logs && <span className="self-center italic text-gray-600">Данные загружены</span>}
                                <div className="mt-2 self-center text-sm italic underline hover:cursor-pointer">{loadState.logs && 'Смотреть журнал'}</div>
                            </div>
                            <div className="text-red-600 text-sm">
                                {loadState?.error}
                            </div>
                        </div>
                    </form>
                }
            </div>
        </div >
    );
} 