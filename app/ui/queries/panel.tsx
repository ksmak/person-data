'use client';

import { createQuery } from "@/app/lib/actions";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Alert
} from "@material-tailwind/react";
import { FormEvent, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Button } from "../button";

export default function SearchPanel({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleOpen = () => { setOpen(false) };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        const createQueryWithId = createQuery.bind(null, id);
        const formData = new FormData(event.currentTarget);
        if (checkingEmptyQuery(formData)) {
            event.preventDefault();
            return;
        }
        await createQueryWithId(undefined, formData);
        handleOpen();
    }

    const checkingEmptyQuery = (formData: FormData) => {
        for (const pair of formData.entries()) {
            if (pair[1]) {
                return false;
            }
        }
        setMessage('Запрос должен содержать хотя бы одно условие');
        return true;
    }

    type Field = {
        title: string,
        name: string,
        fieldType: 'string' | 'number'
    }

    const fields: Field[] = [
        {
            title: 'Фамилия',
            name: 'lastName',
            fieldType: 'string'
        },
        {
            title: 'Имя',
            name: 'firstName',
            fieldType: 'string'
        },
        {
            title: 'Отчество',
            name: 'middleName',
            fieldType: 'string'
        },
        {
            title: 'ИИН',
            name: 'iin',
            fieldType: 'string'
        },
        {
            title: 'Номер телефона',
            name: 'phone',
            fieldType: 'string'
        },
        {
            title: 'Область',
            name: 'region',
            fieldType: 'string'
        },
        {
            title: 'Район',
            name: 'district',
            fieldType: 'string'
        },
        {
            title: 'Наименование улицы',
            name: 'street',
            fieldType: 'string'
        },
        {
            title: 'Корпус',
            name: 'locality',
            fieldType: 'string'
        },
        {
            title: 'Номер дома',
            name: 'house',
            fieldType: 'string'
        },
        {
            title: 'Номер квартиры',
            name: 'apartment',
            fieldType: 'string'
        },
    ]

    return (
        <>
            <Button
                className="flex items-center gap-3"
                onClick={(e) => { e.preventDefault(); setOpen(true); }}
            >
                Новый запрос
                <HiOutlineSearch className="w-4 h-4" />
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <Alert
                    className="absolute top-5 rounded-none border-l-4 border-primary bg-select font-medium text-primarytxt"
                    open={!!message}
                    onClose={() => setMessage('')}
                >
                    {message}
                </Alert>
                <DialogHeader className="m-0 p-0">
                    <div className="w-full mt-20 mb-0 text-2xl text-center text-primarytxt">
                        Новый запрос
                    </div>
                </DialogHeader>
                <DialogBody className="overflow-y-scroll h-[40rem]">
                    <form onSubmit={handleSubmit} id="createQueryForm">
                        <div className="rounded-2xl bg-secondary p-4 md:p-6">
                            {fields.map((fld: Field, index: number) => (
                                <div className="mb-4" key={index}>
                                    <label htmlFor="lastName" className="pl-2 mb-2 block text-sm font-medium">
                                        {fld.title}
                                    </label>
                                    <div className="relative mt-2 rounded-md">
                                        <div className="relative">
                                            <input
                                                className="font-medium block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2"
                                                name={fld.name}
                                                type="text"
                                                defaultValue=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        form="createQueryForm"
                        type="submit"
                    >
                        Начать поиск
                    </Button>
                    <Button
                        className="ml-5"
                        onClick={handleOpen}
                    >
                        <span>Отмена</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}