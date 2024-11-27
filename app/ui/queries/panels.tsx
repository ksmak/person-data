'use client';

import { createQuery } from "@/app/lib/actions";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Alert
} from "@material-tailwind/react";
import { Dispatch, SetStateAction, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Btn } from "@/app/ui/buttons";
import { Person, PersonField } from "@/app/lib/definitions";
import { Query } from "@prisma/client";

export function SearchPanel({ id, setData }: { id: string, setData: Dispatch<SetStateAction<Query[]>> }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [person, setPerson] = useState<Person>({});

    const handleSearch = async () => {
        if (Object.keys(person).length === 0) {
            setMessage('Запрос должен содержать хотя бы одно условие');
            return;
        }
        setOpen(false);
        const createQueryWithId = createQuery.bind(null, id);
        const query = await createQueryWithId(undefined, person);
        setData(prev => [query.query].concat(prev));
    }

    const fields: PersonField[] = [
        {
            title: 'Фамилия',
            name: 'lastName',
        },
        {
            title: 'Имя',
            name: 'firstName',
        },
        {
            title: 'Отчество',
            name: 'middleName',
        },
        {
            title: 'ИИН',
            name: 'iin',
        },
        {
            title: 'Номер телефона',
            name: 'phone',
        },
        {
            title: 'Область',
            name: 'region',
        },
        {
            title: 'Район',
            name: 'district',
        },
        {
            title: 'Наименование улицы',
            name: 'street',
        },
        {
            title: 'Корпус',
            name: 'locality',
        },
        {
            title: 'Номер дома',
            name: 'house',
        },
        {
            title: 'Номер квартиры',
            name: 'apartment',
        },
    ]

    return (
        <>
            <Btn
                className="justify-center gap-2"
                onClick={() => { setPerson({}); setOpen(true); }}
            >
                <span className="hidden md:block">Новый запрос</span>{' '}
                <HiOutlineSearch className="w-5 h-5" />
            </Btn>
            <Dialog open={open} handler={() => { setOpen(false); }}>
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
                <DialogBody className="overflow-y-scroll h-[35rem]">
                    <div className="rounded-2xl bg-secondary p-4 md:p-6">
                        <form>
                            {fields.map((fld: PersonField, index: number) => (
                                <div className="mb-4" key={index}>
                                    <label htmlFor="lastName" className="pl-2 mb-2 block text-sm font-medium">
                                        {fld.title}
                                    </label>
                                    <div className="relative mt-2 rounded-md">
                                        <div className="relative">
                                            <input
                                                className="font-medium block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2"
                                                type="text"
                                                // value={person[`${fld.name}` as keyof typeof person] ? String(person[`${fld.name}` as keyof typeof person]) : undefined}
                                                onChange={(e) => setPerson({ ...person, [`${fld.name}` as keyof typeof person]: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Btn
                        form="createQueryForm"
                        onClick={handleSearch}
                    >
                        Начать поиск
                    </Btn>
                    <Btn
                        className="ml-5"
                        onClick={() => { setOpen(false); }}
                    >
                        <span>Отмена</span>
                    </Btn>
                </DialogFooter>
            </Dialog>
        </>
    )
}