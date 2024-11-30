'use client'

import { Result } from "@/app/lib/definitions";
import { Person } from "@prisma/client";

export default function ResultCard({ result }: { result: Result }) {
    console.log(result);
    switch (result.service) {
        case 'Person Data': {
            const data = result.data as { db_name: string } & Person;
            return (
                <div className="bg-secondary rounded my-3 p-2 border border-borderlight text-sm">
                    <div>Наименование БД{': '}{data.db_name}</div>
                    <div>Ф.И.О.{': '}<span className="font-bold">{data.lastName} {data.firstName} {data.middleName}</span></div>
                    <div>ИИН{': '}<span className="font-bold">{data.iin}</span></div>
                    <div>Номер телефона{': '}<span className="font-bold">{data.phone}</span></div>
                    <div>Адрес{': '}</div>
                    <div>Область/Регион{': '}{data.region}</div>
                    <div>Район{': '}{data.district}</div>
                    <div>Населенный пункт{': '}{data.locality}</div>
                    <div>Улица/Микрорайон{': '}{data.street}</div>
                    <div>Дом{': '}{data.building}</div>
                    <div>Квартира{': '}{data.apartment}</div>
                    <div>Дополнительная информация{': '}</div>
                    {!!data.extendedPersonData && Object.keys(data.extendedPersonData).map((key: string) => (
                        <div className="" key={key}>{key}{':  '}
                            <span className=" font-mono font-medium">
                                {data.extendedPersonData
                                    && data.extendedPersonData[`${key}` as keyof typeof data.extendedPersonData]}
                            </span>
                        </div>
                    ))}
                </div>
            );
        };
        case 'UsersBox API': {
            <div>{JSON.stringify(result.data)}</div>
        }
        default: {
            return (
                <div></div>
            );
        };
    }
}