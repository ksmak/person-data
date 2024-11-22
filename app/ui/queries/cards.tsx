'use client'

import { Person } from "@prisma/client";
import { useRef } from "react";

export function PersonCard({ person }: { person: Person }) {
    const refIin = useRef<HTMLSpanElement>(null)
    const handleClick = async () => {
        const selection = window.getSelection();
        if (selection) {
            await navigator.clipboard.writeText(selection.toString());
            selection.empty();
        }
    }
    return (
        <div className=" bg-secondary rounded my-3 p-4 border border-gray-100">
            <div
                className="font-bold text-md hover:select-all hover:cursor-pointer"
                onClick={handleClick}>
                {person.lastName} {person.firstName} {person.middleName}
            </div>
            <div className="text-sm">
                <div className="p-1">Наименование БД{': '}
                    <span className="italic font-mono font-medium text-md hover:select-all hover:cursor-pointer">
                        {person.Db?.name}
                    </span>
                </div>
                <div className="p-1">ИИН{': '}
                    <span
                        className="italic font-mono font-medium text-md hover:select-all hover:cursor-pointer"
                        onClick={handleClick} ref={refIin}
                    >
                        {person.iin}
                    </span>
                </div>
                <div className="p-1">Номер телефона{': '}
                    <span
                        className="italic font-mono font-medium hover:select-all hover:cursor-pointer"
                        onClick={handleClick}
                    >
                        {person.phone}
                    </span>
                </div>
                <div className="mt-2 ml-5 p-1 font-semibold italic">Адрес проживания:</div>
                <div>
                    <div className="p-1">Область: <span className="italic font-mono font-medium">{person.region}</span></div>
                    <div className="p-1">Район: <span className="italic font-mono font-medium">{person.district}</span></div>
                    <div className="p-1">Нас.пункт: <span className="italic font-mono font-medium">{person.locality}</span></div>
                    <div className="p-1">Дом: <span className="italic font-mono font-medium">{person.building}</span></div>
                    <div className="p-1">Квартира: <span className="italic font-mono font-medium">{person.apartment}</span></div>
                </div>
                <div className="mt-2 ml-5 p-1 font-semibold italic">Дополнительная информация:</div>
                {!!person.extendedPersonData && Object.keys(person.extendedPersonData).map((key: string) => (
                    <div className="p-1">{key}{':  '}
                        <span className="italic font-mono font-medium">
                            {person.extendedPersonData
                                && person.extendedPersonData[`${key}` as keyof typeof person.extendedPersonData]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}