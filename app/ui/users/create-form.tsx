'use client';

import Link from 'next/link';
import { createUser, State } from '@/app/lib/actions';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      <div className="mb-3 flex justify-end gap-4">
        <Button type="submit">Сохранить</Button>
        <Link
          href="/users"
          className="flex h-8 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Закрыть
        </Link>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* isActive */}
        <div className="mb-4">
          <label htmlFor="isActive" className="mb-2 block text-sm font-medium">
            Активный
          </label>
          <div className="relative mt-2 rounded-md place-self-start">
            <div className="relative">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="peer block w-5 h-5 rounded-md border border-gray-200 py-4 pl-10 outline-2 placeholder:text-gray-500  checked:bg-blue-600"
                defaultChecked={true}
              />
            </div>
          </div>
        </div>
        {/* login */}
        <div className="mb-4">
          <label htmlFor="login" className="mb-2 block text-sm font-medium">
            Логин
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="login"
                name="login"
                type="text"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="login-error"
              />
            </div>
            <div id="login-error" aria-live="polite" aria-atomic="true">
              {state.errors?.login &&
                state.errors.login.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Пароль
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="password-error"
              />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* lastName */}
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            Фамилия
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="login-error"
              />
            </div>
            <div id="lastName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lastName &&
                state.errors.lastName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* firstName */}
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            Имя
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="firstName-error"
              />
            </div>
            <div id="firstName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstName &&
                state.errors.firstName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* middleName */}
        <div className="mb-4">
          <label htmlFor="middleName" className="mb-2 block text-sm font-medium">
            Отчество
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="middleName"
                name="middleName"
                type="text"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="middleName-error"
              />
            </div>
            <div id="middleName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.middleName &&
                state.errors.middleName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
