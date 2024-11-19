'use client'

import { addShedullerJob, removeShedullerJob } from "@/app/lib/actions";
import { FormEvent, useState } from "react"
import { Btn } from "@/app/ui/buttons";

export function AddShedullerJobButton() {
    const [state, setState] = useState<string>('');

    const handlerSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState(await addShedullerJob(''));
    }

    return (
        <div>
            <form onSubmit={handlerSubmit}>
                <Btn type="submit"> Запустить планировщик </Btn>
                {state}
            </form>
        </div>
    );
}

export function RemoveShedullerJobButton() {
    const [state, setState] = useState<string>('');

    const handlerSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState(await removeShedullerJob(''));
    }

    return (
        <div>
            <form onSubmit={handlerSubmit}>
                <Btn type="submit"> Остановить планировщик </Btn>
                {state}
            </form>
        </div>
    );
}