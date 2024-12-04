import { fetchUserByEmail } from "@/app/lib/data";
import { Result, ResultField } from "@/app/lib/definitions";
import { getResults } from "@/app/lib/utils";
import { auth } from "@/auth";
import {
    Paragraph,
    TextRun,
    Document,
    Header,
    HeadingLevel,
    AlignmentType,
    ShadingType,
    Packer
} from "docx";

export async function POST(request: Request) {
    console.log('start print!')
    try {
        const session = await auth();

        const email = session?.user?.email;

        if (!email) throw new Error('User not authenticated.');

        const user = await fetchUserByEmail(email);

        if (!user?.isAdmin) throw new Error('User not found.');

        const json = await request.json();

        let items: any = [];

        json.results.map(async (result: Result) => {
            if (!result.error) {
                items.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                            }),
                        ],
                    }));

                const result_fields = getResults(result);

                result_fields.map((it: ResultField) => {
                    items.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${it.title} : ${it.value}`,
                                }),
                            ]
                        }));
                });
            }
        });

        const doc = new Document({
            title: "Person Data: results",
            description: "Person Data: results",
            sections: [
                {
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    text: "PERSON DATA",
                                    heading: HeadingLevel.HEADING_6,
                                    alignment: AlignmentType.RIGHT,
                                }),
                                new Paragraph({
                                    text: `Пользователь: ${user?.lastName} ${user?.firstName} ${user?.middleName}`,
                                    heading: HeadingLevel.HEADING_6,
                                    alignment: AlignmentType.RIGHT,
                                }),
                            ],
                        }),
                    },
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "Результаты запроса",
                            heading: HeadingLevel.HEADING_1,
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

        const blob = await Packer.toBlob(doc);

        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename=results.docx',
            },
        });
    } catch (e) {
        return new Response('Error printing!', {
            status: 500
        })
    }
}