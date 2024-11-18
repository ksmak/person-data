import { Person } from "@prisma/client";

export function PersonCard({ person }: { person: Person }) {
    return (
        <div className="bg-gray-50 rounded m-5 p-4">
            <div className="font-bold text-md">{person.lastName} {person.firstName} {person.middleName}</div>
            <div className="text-sm">
                <div>ИИН: <span className="font-semibold">{person.iin}</span></div>
                <div>Номер телефона: <span>{person.phone}</span></div>
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