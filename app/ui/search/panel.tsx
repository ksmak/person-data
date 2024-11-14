'use client';

import { createQuery } from "@/app/lib/actions";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Alert
} from "@material-tailwind/react";
import { FormEvent, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function SearchPanel({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleOpen = () => { setOpen(false) };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const createQueryWithId = createQuery.bind(null, id);
        const formData = new FormData(event.currentTarget);
        if (checkingEmptyQuery(formData)) return;
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
                variant="gradient"
                color="blue"
                size="md"
                onClick={(e) => { e.preventDefault(); setOpen(true); }}
            >
                Новый запрос
                <HiOutlineSearch className="w-4 h-4" />
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Новый запрос
                    </Typography>
                </DialogHeader>
                <DialogBody className="overflow-y-scroll h-[42rem]">
                    <Alert
                        className="rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
                        open={!!message}
                        onClose={() => setMessage('')}
                    >
                        {message}
                    </Alert>
                    <form onSubmit={handleSubmit} id="createQueryForm">
                        <div className="rounded-md bg-gray-50 p-4 md:p-6">
                            {fields.map((fld: Field, index: number) => (
                                <div className="mb-4" key={index}>
                                    <label htmlFor="lastName" className="pl-2 mb-2 block text-sm font-medium">
                                        {fld.title}
                                    </label>
                                    <div className="relative mt-2 rounded-md">
                                        <div className="relative">
                                            <input
                                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
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
                    <button
                        form="createQueryForm"
                        type="submit"
                        className="ml-4 flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Начать поиск
                    </button>
                    <button
                        className="ml-4 flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        onClick={handleOpen}
                    >
                        <span>Отмена</span>
                    </button>
                </DialogFooter>
            </Dialog>
        </>
    )
}