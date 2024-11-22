'use client'

import { Person } from "@prisma/client";
import Image from "next/image";
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
            <div className="w-full flex justify-between gap-4 flex-wrap">
                <Image className="grow-0"
                    src={person.photo ? `/images/${person.photo}` : "/default.jpg"}
                    width={300}
                    height={200}
                    alt="photo"
                />
                <div className="grow">
                    <div
                        className="font-bold text-md hover:select-all hover:cursor-pointer"
                        onClick={handleClick}>
                        {person.lastName} {person.firstName} {person.middleName}
                    </div>
                    <div className="text-sm">
                        <div className="p-1">ИИН{': '}
                            <span
                                className=" font-mono font-medium text-md hover:select-all hover:cursor-pointer"
                                onClick={handleClick} ref={refIin}
                            >
                                {person.iin}
                            </span>
                        </div>
                        <div className="p-1">Номер телефона{': '}
                            <span
                                className=" font-mono font-medium hover:select-all hover:cursor-pointer"
                                onClick={handleClick}
                            >
                                {person.phone}
                            </span>
                        </div>
                        <div className="mt-2 p-1 italic">Адрес проживания:</div>
                        <div>
                            <div className="p-1">Область: <span className=" font-mono font-medium">{person.region}</span></div>
                            <div className="p-1">Район: <span className=" font-mono font-medium">{person.district}</span></div>
                            <div className="p-1">Нас.пункт: <span className=" font-mono font-medium">{person.locality}</span></div>
                            <div className="p-1">Дом: <span className=" font-mono font-medium">{person.building}</span></div>
                            <div className="p-1">Квартира: <span className=" font-mono font-medium">{person.apartment}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 p-1 italic">Дополнительная информация:</div>
            <div className="p-1">Наименование БД{': '}
                <span className=" font-mono font-medium text-md hover:select-all hover:cursor-pointer">
                    {person.Db?.name}
                </span>
            </div>
            {!!person.extendedPersonData && Object.keys(person.extendedPersonData).map((key: string) => (
                <div className="p-1" key={key}>{key}{':  '}
                    <span className=" font-mono font-medium">
                        {person.extendedPersonData
                            && person.extendedPersonData[`${key}` as keyof typeof person.extendedPersonData]}
                    </span>
                </div>
            ))}
        </div>
    )
}