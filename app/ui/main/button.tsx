'use client'

import { addShedullerJob, removeShedullerJob } from "@/app/lib/actions";
import { FormEvent, useState } from "react"
import { Button } from "@/app/ui/button";

export function AddShedullerJobButton() {
    const [state, setState] = useState<string>('');

    const handlerSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState(await addShedullerJob(''));
    }

    return (
        <div>
            <form onSubmit={handlerSubmit}>
                <Button type="submit"> Запустить планировщик </Button>
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
                <Button type="submit"> Остановить планировщик </Button>
                {state}
            </form>
        </div>
    );
}