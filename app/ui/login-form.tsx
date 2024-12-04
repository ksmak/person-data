'use client'

import { Button } from '@material-tailwind/react';
import { FormEvent, useState } from 'react';
import { HiArrowSmRight, HiCash, HiExclamationCircle, HiKey } from 'react-icons/hi';
import { login } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { LoginState } from '../lib/definitions';

export default function LoginForm() {
  const [state, setState] = useState<LoginState>({});
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const state: LoginState = await login(formData) as LoginState;
    setState(state);
    router.push("/dashboard");
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg px-4 pb-4 pt-4">
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Ваш логин (почтовый адрес)
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-borderlight py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Введите ваш email"
                required
              />
              <HiCash className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="text-xs text-red-500">{state?.errors?.email}</p>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Пароль
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-borderlight py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Введите пароль"
                required
              />
              <HiKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="text-xs text-red-500">{state?.errors?.password}</p>
          </div>
        </div>
        <Button className="mt-10 w-full flex justify-center items-center gap-4 bg-primary" type='submit'>
          <div>Войти</div>
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state?.message && (
            <>
              <HiExclamationCircle className="h-5 w-5 text-red-500" />
              <p className="text-xs text-red-500">{state?.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
