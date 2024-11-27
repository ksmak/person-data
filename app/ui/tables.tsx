'use client'

import { Card, Typography } from "@material-tailwind/react";
import { TableHead } from "@/app/lib/definitions";
import clsx from "clsx";
import moment from "moment";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatQueryCondition } from "@/app/lib/utils";

export function Tbl({ tableHeads, tableRows, url
}: { tableHeads: TableHead[], tableRows: any[], url: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const orderBy = searchParams.get('orderBy');
    const sort = searchParams.get('sort');

    const handleOrder = (fieldName: string) => {
        const params = new URLSearchParams(searchParams);
        const sort = params.get('sort');
        params.set('orderBy', fieldName);
        params.set('sort', sort === null ? 'asc' : sort === 'asc' ? 'desc' : 'asc');
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <Card className="h-full w-full mt-5 max-h-max overflow-auto">
            <table className="w-full table-auto text-left min-w-max">
                <thead>
                    <tr>
                        {tableHeads.map((head, index) => {
                            const classes = index === 0 ? "rounded-tl-lg" : index === tableHeads.length - 1 ? "rounded-tr-lg" : "";

                            return (
                                <th
                                    key={index}
                                    className={clsx("border-b border-borderlight bg-select p-4 hover:cursor-pointer", classes)}
                                    onClick={() => head.fieldType !== 'nested' && handleOrder(head.name)}
                                >
                                    <Typography
                                        variant="small"
                                        className="text-primarytxt font-normal leading-none opacity-90"
                                    >
                                        <span className="">{head.title}</span>
                                        {orderBy === head.name && head.fieldType !== 'nested'
                                            ? sort === 'asc' ? <HiOutlineChevronUp className="ml-2 inline" /> : <HiOutlineChevronDown className="ml-2 inline" />
                                            : null}
                                    </Typography>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row: any, index) => {
                        const isLast = index === tableRows.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b borderlight";

                        return (
                            <tr key={index}
                                className=" hover:cursor-pointer hover:bg-secondary"
                                onClick={() => router.push(`${url}/${row.id}/edit`)} >
                                {tableHeads.map((head, index) => {
                                    switch (head.fieldType) {
                                        case 'string': {
                                            return (
                                                <td key={index} className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {row[`${head.name}` as keyof typeof row]}
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                        case 'date': {
                                            const dt = row[`${head.name}` as keyof typeof row]
                                                ? moment(row[`${head.name}` as keyof typeof row]).format('DD.MM.YYYY')
                                                : "";
                                            return (
                                                <td key={index} className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {dt}
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                        case 'datetime': {
                                            const dt = row[`${head.name}` as keyof typeof row]
                                                ? moment(row[`${head.name}` as keyof typeof row]).format('DD.MM.YYYY HH:mm')
                                                : "";
                                            return (
                                                <td key={index} className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {dt}
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                        case 'nested': {
                                            return (
                                                <td key={index} className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {row[`${head.name}`][`${head.nestedName}`]}
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                        case 'active': {
                                            return (
                                                <td key={index} className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {row[`${head.name}` as keyof typeof row]
                                                            ? <span className="w-10 text-green-600 border border-green-600 p-0 text-center text-xs">Активный</span>
                                                            : <span className="w-10 text-red-600 border border-red-600 p-0 text-center text-xs">Не активный</span>
                                                        }
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                        case 'queryState': {
                                            return (
                                                <td key={index} className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {row[`${head.name}` as keyof typeof row] === 'WAITING'
                                                            ? <span className="text-orange-600 border border-orange-600 p-1 text-center text-xs">в процессе</span>
                                                            : row[`${head.name}` as keyof typeof row] === "SUCCESS"
                                                                ? <span className="text-green-600 border border-green-600 p-1 text-center text-xs">выполнен</span>
                                                                : <span className="text-red-600 border border-red-600 p-1 text-center text-xs">ошибка</span>
                                                        }
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                        case 'queryBody': {
                                            return (
                                                <td key={index} className={clsx(classes, " w-96 h-20 text-wrap overflow-y-auto")} >
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        <span>
                                                            {formatQueryCondition(row[`${head.name}` as keyof typeof row])}
                                                        </span>
                                                    </Typography>
                                                </td>
                                            )
                                        }
                                    }
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    );
}