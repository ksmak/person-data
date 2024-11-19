'use client';

import Link from 'next/link';
import { SubscriptionState, updateSubscription, createSubscription } from '@/app/lib/actions';
import { FormEvent, useState } from 'react';
import { Subscription } from '@prisma/client';
import { ModalDeleteUser } from '@/app/ui/subscriptions/modal';
import { EditButtonsGroup } from '@/app/ui/buttons';
import { Checkbox } from '@material-tailwind/react';

export default function SubscriptionForm({
  sub
}: {
  sub: Subscription | null
}) {
  const [state, setState] = useState<SubscriptionState>({ message: null, errors: {} });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let action;
    if (sub) {
      action = updateSubscription.bind(null, sub.id);
    } else {
      action = createSubscription;
    }

    const formData = new FormData(event.currentTarget)
    const initialState: SubscriptionState = { message: null, errors: {} };
    setState(await action(initialState, formData));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3 flex justify-end gap-4">
        <EditButtonsGroup item={sub} handleOpen={handleOpen} url='/subscriptions' />
      </div>
      <div className="rounded-md bg-secondary p-4 md:p-6">
        <p className="mt-2 text-sm text-red-500 text-center mb-2">{state.message}</p>
        {/* title */}
        <div className="mb-4">
          <label htmlFor="title" className="pl-2 mb-2 block text-sm font-medium">
            Наименование
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="title"
                name="title"
                type="text"
                defaultValue={sub?.title ? sub.title : ""}
                aria-describedby="title-error"
              />
            </div>
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors.title.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* maxQueriesDay */}
        <div className="mb-4">
          <label htmlFor="maxQueriesDay" className="pl-2 mb-2 block text-sm font-medium">
            Максимальное количество запросов в день
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="maxQueriesDay"
                name="maxQueriesDay"
                type="number"
                defaultValue={sub?.maxQueriesDay ? sub.maxQueriesDay > 0 ? sub.maxQueriesDay : "" : ""}
                aria-describedby="maxQueriesDay-error"
              />
            </div>
            <div id="maxQueriesDay-error" aria-live="polite" aria-atomic="true">
              {state.errors?.maxQueriesDay &&
                state.errors.maxQueriesDay.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* maxQueriesMonth */}
        <div className="mb-4">
          <label htmlFor="maxQueriesMonth" className="pl-2 mb-2 block text-sm font-medium">
            Максимальное количество запросов в месяц
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="maxQueriesMonth"
                name="maxQueriesMonth"
                type="number"
                defaultValue={sub?.maxQueriesMonth ? sub.maxQueriesMonth > 0 ? sub.maxQueriesMonth : "" : ""}
                aria-describedby="maxQueriesMonth-error"
              />
            </div>
            <div id="maxQueriesMonth-error" aria-live="polite" aria-atomic="true">
              {state.errors?.maxQueriesMonth &&
                state.errors.maxQueriesMonth.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* maxQueriesTotal */}
        <div className="mb-4">
          <label htmlFor="maxQueriesTotal" className="pl-2 mb-2 block text-sm font-medium">
            Максимальное количество запросов
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="maxQueriesTotal"
                name="maxQueriesTotal"
                type="number"
                defaultValue={sub?.maxQueriesTotal ? sub.maxQueriesTotal > 0 ? sub.maxQueriesTotal : "" : ""}
                aria-describedby="maxQueriesTotal-error"
              />
            </div>
            <div id="maxQueriesTotal-error" aria-live="polite" aria-atomic="true">
              {state.errors?.maxQueriesTotal &&
                state.errors.maxQueriesTotal.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* usageTimeLimit */}
        <div className="mb-4">
          <label htmlFor="usageTimeLimit" className="pl-2 mb-2 block text-sm font-medium">
            Ограничение использования системы по времени (в часах)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="usageTimeLimit"
                name="usageTimeLimit"
                type="number"
                defaultValue={sub?.usageTimeLimit ? sub.usageTimeLimit > 0 ? sub.usageTimeLimit : "" : ""}
                aria-describedby="usageTimeLimit-error"
              />
            </div>
            <div id="usageTimeLimit-error" aria-live="polite" aria-atomic="true">
              {state.errors?.usageTimeLimit &&
                state.errors.usageTimeLimit.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* accessImportData */}
        <div className="mb-4">
          <div className="flex gap-4 items-center place-self-start">
            <Checkbox
              className="peer w-5 h-5 bg-primary checked:bg-primary checked:border-none"
              id="accessImportData"
              name="accessImportData"
              type="checkbox"
              defaultChecked={sub ? sub.accessImportData : false}
            />
            <div className="text-sm font-medium">
              Доступ к подсистеме "Загрузка данных"
            </div>
          </div>
        </div>
        {/* accessMonitoring */}
        <div className="mb-4">
          <div className="flex gap-4 items-center place-self-start">
            <Checkbox
              className="bg-primary checked:bg-primary checked:border-none"
              id="accessMonitoring"
              name="accessMonitoring"
              type="checkbox"
              defaultChecked={sub ? sub.accessMonitoring : false}
            />
            <div className="text-sm font-medium">
              Доступ к подсистеме "Мониторинг запросов"
            </div>
          </div>
        </div>
        {/* accessUsers */}
        <div className="mb-4">
          <div className="flex gap-4 items-center place-self-start">
            <Checkbox
              className="peeh-5 bg-primary checked:bg-primary checked:border-none"
              id="accessUsers"
              name="accessUsers"
              type="checkbox"
              defaultChecked={sub ? sub.accessUsers : false}
            />
            <div className="text-sm font-medium">
              Доступ к подсистеме "Пользователи"
            </div>
          </div>
        </div>
      </div>
      {sub?.id && <ModalDeleteUser id={sub.id} open={open} handleOpen={handleOpen} />}
    </form >
  );
}
