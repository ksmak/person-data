import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { Btn, SecondaryBtn } from "../buttons";
import { Dispatch, SetStateAction } from "react";
import { HiOutlineX } from "react-icons/hi";

export function LogModal({
    open,
    setOpen,
    logs
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    logs: string[];
}) {
    const handleClick = async () => {
        await navigator.clipboard.writeText(logs.join(""));
        alert('Данные скопированы в буфер обмена.');
    };

    return (
        <Dialog open={open} handler={() => { setOpen(false); }} size="lg" >
            <DialogHeader className="grid grid-cols-3 bg-primary text-white">
                <div className="col-start-2 justify-self-center">Журнал</div>
                <SecondaryBtn
                    className='justify-center justify-self-end'
                    onClick={() => { setOpen(false); }}
                >
                    <HiOutlineX className='h-5 w-5' />
                </SecondaryBtn>
            </DialogHeader>
            <DialogBody className="overflow-y-scroll h-[40rem] p-0">
                <div className="flex flex-col justify-end">

                    {logs.length > 0 && <SecondaryBtn
                        className="absolute top-5 self-end rounded-xl w-fit"
                        onClick={handleClick}
                    >
                        Копировать
                    </SecondaryBtn>}
                </div>
                <div className="bg-secondary w-full rounded-md">
                    {logs.map((log: string, index: number) => (
                        <pre key={index} className="text-sm font-sans font-normal">{log}</pre>
                    ))}
                </div>
            </DialogBody>
        </Dialog>
    );
};