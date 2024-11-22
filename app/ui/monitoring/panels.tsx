'use client'

import { User } from "@prisma/client";

export function UserQueriesPanel({ user }: { user: User }) {
    return (
        <div className="w-full h-full">
            <div className="text-lg text-gray-900">Запросы пользователя</div>
            <div className="mt-5 text-sm">{user.lastName} {user.firstName} {user.middleName}</div>

        </div>
    );
};