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
        <div className="bg-secondary rounded m-2 p-4">
            <div
                className="font-bold text-md hover:select-all hover:cursor-pointer"
                onClick={handleClick}>
                {person.lastName} {person.firstName} {person.middleName}
            </div>
            <div className="text-sm">
                <div>ИИН:
                    <span className="font-semibold hover:select-all hover:cursor-pointer" onClick={handleClick} ref={refIin}>
                        {person.iin}
                    </span>
                </div>
                <div>Номер телефона: <span className="font-semibold hover:select-all hover:cursor-pointer" onClick={handleClick}>{person.phone}</span></div>
                <div>
                    <div>Адрес проживания</div>
                    <div>
                        <div>Область: <span>{person.region}</span></div>
                        <div>Район: <span>{person.district}</span></div>
                        <div>Нас.пункт: <span>{person.locality}</span></div>
                        <div>Дом: <span>{person.building}</span></div>
                        <div>Квартира: <span>{person.apartment}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}