'use client'

import { Result } from "@/app/lib/definitions";
import { fieldHelper } from "@/app/lib/fields";
import { Person } from "@prisma/client";

export default function ResultCard({ result }: { result: Result }) {
    switch (result.service) {
        case 'Qarau API': {
            const data = result.data as { db_name: string } & Person;
            return (
                <div className="bg-secondary rounded my-3 p-2 border border-borderlight text-sm">
                    <div>База данных{': '}{data.db_name}</div>
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
            return (
                <div className="bg-secondary rounded my-3 p-2 border border-borderlight text-sm">
                    <div>База данных: <span className="font-bold">{result.data?.source?.database}</span></div>
                    <div>Коллекция: <span className="font-bold">{result.data?.source?.collection}</span></div>
                    {result.data?.hits?.items && result.data.hits.items.map((item: any) => (
                        Object.keys(item).map((k: string, index: number) => (
                            <div key={index}>
                                {fieldHelper[`${k}` as keyof typeof fieldHelper]
                                    ? typeof item[`${k}`] === 'object'
                                        ? <div>{fieldHelper[`${k}` as keyof typeof fieldHelper]}: <span className="font-bold">{JSON.stringify(item[`${k}`])}</span></div>
                                        : <div>{fieldHelper[`${k}` as keyof typeof fieldHelper]}: <span className="font-bold">{String(item[`${k}`])}</span></div> : null}
                            </div>
                        ))))}
                </div>
            )
        }
        default: {
            return (
                <div className="bg-secondary rounded my-3 p-2 border border-borderlight text-sm">
                    {JSON.stringify(result.data, null, 2)}
                </div>
            );
        };
    }
}