// import * as fs from "fs";
import { AlignmentType, Document, FileChild, HeadingLevel, Packer, Paragraph, ShadingType, TextRun } from "docx";
import { fetchQueryById } from "@/app/lib/data";
import { Person } from "@prisma/client";
import { randomUUID } from "crypto";
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static'

export async function GET(request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    const query = await fetchQueryById(id);

    let items: FileChild[] = [];

    if (query?.result) {
        try {
            const data = JSON.parse(query.result);
            if (data && data.length) {
                data.map((item: Person) => {
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `${item.lastName ? item.lastName : ""} ${item.firstName ? item.lastName : ""} ${item.middleName ? item.middleName : ""}`,
                                bold: true,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `ИИН: ${item.iin ? item.iin : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Номер телефона: ${item.phone ? item.phone : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Адрес проживания`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Область/Регион: ${item.region ? item.region : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Район: ${item.district ? item.district : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Нас.пункт: ${item.locality ? item.locality : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Улица/Микрорайон: ${item.street ? item.street : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Дом: ${item.building ? item.building : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Квартира: ${item.apartment ? item.apartment : ""}`,
                            }),
                        ]
                    }));
                    items.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                            }),
                        ]
                    }));
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    const doc = new Document({
        title: "Результаты запроса",
        description: "Person Data: results",
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: "Результаты запроса",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        shading: {
                            type: ShadingType.REVERSE_DIAGONAL_STRIPE,
                            color: "#f0fdf4",
                            fill: "#f0fdf4",
                        },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                            }),
                        ],
                    }),
                    ...items,
                ],
            },
        ],
    });

    const data = await Packer.toBlob(doc);

    return new Response(data, {
        headers: {
            'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'content-disposition': 'attachment; filename=results.docx',
        },
    });

}