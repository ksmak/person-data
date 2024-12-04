'use client'

import { Result, ResultField } from "@/app/lib/definitions";
import { getResults } from "@/app/lib/utils";
import { MouseEvent, useRef, useState } from "react";

export default function ResultCard({ result }: { result: Result }) {
    const [visible, setVisible] = useState(false);
    const result_fields = getResults(result);
    const refText = useRef<HTMLSpanElement>(null);

    const handleSelectText = (event: MouseEvent<HTMLSpanElement>) => {
        navigator.clipboard.writeText(event.currentTarget.innerText)
            .then(() => {
                setVisible(true);
                setTimeout(() => {
                    setVisible(false);
                }, 1000)
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    }

    return (
        <div className="mt-5 text-sm antialiased tracking-wide bg-white p-4 rounded-md w-full">
            {result_fields.map((item: ResultField, index: number) => (
                <div key={index}>
                    <span className="font-thin text-gray-800">{item.title}{': '}</span>
                    <span
                        className="mono select-all hover:cursor-pointer"
                        onClick={handleSelectText}
                        ref={refText}
                    >
                        {item.value}
                    </span>
                </div>
            ))}
            {visible && <div className="absolute bottom-10">скопировано в буфер обмена!</div>}
        </div>
    );
}