'use client';

import { createUser, updateUser, State } from '@/app/lib/actions';
import { FormEvent, useState } from 'react';
import { Subscription, User } from '@prisma/client';
import { ModalDeleteUser } from '@/app/ui/users/modal';
import { EditButtonsGroup } from '@/app/ui/buttons';
import { SubscriptionCard } from '@/app/ui/users/cards';

export default function UserForm({
  user,
  subs,
}: {
  user: User | null,
  subs: Subscription[],
}) {
  const [state, setState] = useState<State>({ message: null, errors: {} });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let action;
    if (user) {
      action = updateUser.bind(null, user.id);
    } else {
      action = createUser;
    }

    const formData = new FormData(event.currentTarget);
    const initialState: State = { message: null, errors: {} };
    setState(await action(initialState, formData));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3 flex justify-end gap-4">
        <EditButtonsGroup item={user} handleOpen={handleOpen} url='/dashboard/users' />
      </div>
      <div className="rounded-md bg-secondary p-4 md:p-6">
        <p className="mt-2 text-sm text-red-500 text-center mb-2">{state.message}</p>
        {/* isActive */}
        <div className="mb-4">
          <div className="flex gap-4 items-center place-self-start">
            <input
              className="peer block w-5 h-5 bg-primary checked:bg-primary checked:border-none"
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={user ? user.isActive : true}
            />
            <div className="text-sm font-medium">
              Активный
            </div>
          </div>
        </div>
        {/* email */}
        <div className="mb-4">
          <label htmlFor="email" className="pl-2 mb-2 block text-sm font-medium">
            Логин
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                name="email"
                type="text"
                defaultValue={user?.email ? user.email : ""}
                aria-describedby="email-error"
              />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* password */}
        <div className="mb-4">
          <label htmlFor="password" className="pl-2 mb-2 block text-sm font-medium">
            Пароль
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                name="password"
                type="password"
                defaultValue=""
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
          <label htmlFor="lastName" className="pl-2 mb-2 block text-sm font-medium">
            Фамилия
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={user?.lastName ? user.lastName : ""}
                aria-describedby="lastName-error"
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
          <label htmlFor="firstName" className="pl-2 mb-2 block text-sm font-medium">
            Имя
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={user?.firstName ? user.firstName : ""}
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
          <label htmlFor="middleName" className="pl-2 mb-2 block text-sm font-medium">
            Отчество
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="middleName"
                name="middleName"
                type="text"
                defaultValue={user?.middleName ? user.middleName : ""}
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
        {/* subscription */}
        <div className="mb-4">
          <label htmlFor="isActive" className="pl-2 mb-2 block text-sm font-medium">
            Подписка
          </label>
          <div className='flex items-center flex-wrap gap-5'>
            {subs.map((sub: Subscription) => (
              <div className="relative mt-2 pl-1 rounded-md place-self-start" key={sub.id}>
                <div className="relative">
                  <input
                    className='h-5 w-5 bg-primary checked:bg-primary checked:border-none'
                    type='radio'
                    name='subsId'
                    color='green'
                    defaultValue={sub.id}
                    defaultChecked={user?.subsId === sub.id}
                  />
                </div>
                <SubscriptionCard sub={sub} />
              </div>
            ))}
            <div id="subsId-error" aria-live="polite" aria-atomic="true">
              {state.errors?.subsId &&
                state.errors.subsId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      {user?.id && <ModalDeleteUser id={user.id} open={open} handleOpen={handleOpen} />}
    </form >
  );
}
