'use client';

import { DeleteUser } from "@/app/ui/users/buttons";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export function ModalDeleteUser({ id, open, handleOpen
}: {
    id: string,
    open: boolean,
    handleOpen: () => void,
}) {
    return (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Удаление</DialogHeader>
            <DialogBody>
                Удалить пользователя?
            </DialogBody>
            <DialogFooter>
                <button
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    onClick={handleOpen}
                >
                    <span>Отмена</span>
                </button>
                <DeleteUser id={id} />
            </DialogFooter>
        </Dialog>
    )
}