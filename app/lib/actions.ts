'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from './db';

const EXPIRED_PASSWORD_DAYS = 30;

const FormSchema = z.object({
    id: z.string(),
    isActive: z.boolean(),
    login: z.string(),
    password: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    middleName: z.string(),
    expiredPwd: z.date(),
});

export type State = {
    errors?: {
        login?: string[];
        password?: string[];
        lastName?: string[];
        firstName?: string[];
        middleName?: string[];
    };
    message?: string | null;
};

const CreateUser = FormSchema.omit({ id: true, isActive: true, expiredPwd: true });
const UpdateUser = FormSchema.omit({ id: true, isActive: true, expiredPwd: true });

export async function createUser(prevState: State, formData: FormData) {
    const validatedFields = CreateUser.safeParse({
        login: formData.get('login'),
        password: formData.get('password'),
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName'),
        middleName: formData.get('middleName'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Возникли ошибки при добавлении пользователя.',
        };
    }

    const { login, password, lastName, firstName, middleName } = validatedFields.data;
    const now = new Date();
    const expiredPwd = new Date(now.setDate(now.getDate() + EXPIRED_PASSWORD_DAYS));
    const isActive = !!formData.get('isActive');

    await prisma.user.create({
        data: {
            isActive: isActive,
            login: login,
            password: password,
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            expiredPwd: expiredPwd,
        }
    })

    revalidatePath('/users');
    redirect('/users');
}

export async function updateUser(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateUser.safeParse({
        login: formData.get('login'),
        password: formData.get('password'),
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName'),
        middleName: formData.get('middleName'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Возникли ошибки при изменении пользователя.',
        };
    }

    const { login, password, lastName, firstName, middleName } = validatedFields.data;
    const now = new Date();
    const expiredPwd = new Date(now.setDate(now.getDate() + EXPIRED_PASSWORD_DAYS));
    const isActive = !!formData.get('isActive');

    await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            isActive: isActive,
            login: login,
            password: password,
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            expiredPwd: expiredPwd,
        }
    })

    revalidatePath('/users');
    redirect('/users');
}

export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: {
            id: id
        }
    })

    revalidatePath('/users');
    redirect('/users');
}