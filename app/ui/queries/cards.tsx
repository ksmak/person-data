'use client'

import { Db, Person } from "@prisma/client";
import Image from "next/image";
import { useRef } from "react";

export function PersonCard({ person }: { person: {Db: Db | null;} & Person }) {
    const refIin = useRef<HTMLSpanElement>(null)
    const handleClick = async () => {
        const selection = window.getSelection();
        if (selection) {
            await navigator.clipboard.writeText(selection.toString());
            selection.empty();
        }
    }
    return (
        <div className=" bg-secondary rounded my-3 p-2 border border-borderlight text-sm">
            <div className="w-full flex justify-between gap-4 flex-wrap">
                <div className="border border-borderlight w-[250px] h-[300px]">
                {person.photo && <Image className="grow-0"
                    src={person.photo ? `/images/${person.photo}` : "/default.jpg"}
                    width={300}
                    height={250}
                    alt="photo"
                />}
                </div>
                <div className="grow">
                    <div
                        className="font-bold hover:select-all hover:cursor-pointer"
                        onClick={handleClick}>
                        {person.lastName} {person.firstName} {person.middleName}
                    </div>
                    <div className="">
                        <div className="">ИИН{': '}
                            <span
                                className=" font-mono font-medium hover:select-all hover:cursor-pointer"
                                onClick={handleClick} ref={refIin}
                            >
                                {person.iin}
                            </span>
                        </div>
                        <div className="">Номер телефона{': '}
                            <span
                                className=" font-mono font-medium hover:select-all hover:cursor-pointer"
                                onClick={handleClick}
                            >
                                {person.phone}
                            </span>
                        </div>
                        <div className="mt-2  italic">Адрес проживания:</div>
                        <div>
                            <div className="">Область: <span className=" font-mono font-medium">{person.region}</span></div>
                            <div className="">Район: <span className=" font-mono font-medium">{person.district}</span></div>
                            <div className="">Нас.пункт: <span className=" font-mono font-medium">{person.locality}</span></div>
                            <div className="">Дом: <span className=" font-mono font-medium">{person.building}</span></div>
                            <div className="">Квартира: <span className=" font-mono font-medium">{person.apartment}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2  italic">Дополнительная информация:</div>
            <div className="">Наименование БД{': '}
                <span className=" font-mono font-medium hover:select-all hover:cursor-pointer">
                    {person.Db?.name}
                </span>
            </div>
            {!!person.extendedPersonData && Object.keys(person.extendedPersonData).map((key: string) => (
                <div className="" key={key}>{key}{':  '}
                    <span className=" font-mono font-medium">
                        {person.extendedPersonData
                            && person.extendedPersonData[`${key}` as keyof typeof person.extendedPersonData]}
                    </span>
                </div>
            ))}
        </div>
    )
}