'use client';

import { deleteSubscription } from "@/app/lib/actions";
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
    const handleDelete = async () => {
        const deleteSubscriptionWithId = deleteSubscription.bind(null, id);
        await deleteSubscriptionWithId();
        handleOpen();
    }

    return (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Удаление</DialogHeader>
            <DialogBody>
                Удалить подписку?
            </DialogBody>
            <DialogFooter>
                <button
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    onClick={handleOpen}
                >
                    <span>Отмена</span>
                </button>
                <button
                    className="inline-flex w-full justify-center gap-2 items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleDelete}
                >
                    Удалить
                </button>
            </DialogFooter>
        </Dialog>
    )
}