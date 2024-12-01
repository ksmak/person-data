'use client';

import { SubscriptionState, updateSubscription, createSubscription } from '@/app/lib/actions';
import { FormEvent, useState } from 'react';
import { Subscription } from '@prisma/client';
import { ModalDeleteSubscription } from '@/app/ui/admin/subscriptions/modal';
import { EditButtonsGroup } from '@/app/ui/buttons';

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
        <EditButtonsGroup item={sub} handleOpen={handleOpen} url='/dashboard/subscriptions' />
      </div>
      <div className="rounded-lg bg-secondary border borderlight p-4 md:p-6">
        <p className="mt-2 text-sm text-red-500 text-center mb-2">{state.message}</p>
        {/* title */}
        <div className="mb-4">
          <label htmlFor="title" className="pl-2 mb-2 block text-sm font-medium">
            Наименование
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-borderlight py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
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
        {/* queriesCount */}
        {/* <div className="mb-4">
          <label htmlFor="maxQueriesDay" className="pl-2 mb-2 block text-sm font-medium">
            Количество запросов
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full md:w-28 rounded-md border border-borderlight py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="queriesCount"
                name="queriesCount"
                type="number"
                defaultValue={sub?.queriesCount ? sub.queriesCount > 0 ? sub.queriesCount : "" : ""}
                aria-describedby="maxQueriesDay-error"
              />
            </div>
            <div id="queriesCount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.queriesCount &&
                state.errors.queriesCount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div> */}
        {/* price */}
        {/* <div className="mb-4">
          <label htmlFor="maxQueriesDay" className="pl-2 mb-2 block text-sm font-medium">
            Цена
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full md:w-28 rounded-md border border-borderlight py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="price"
                name="price"
                type="number"
                defaultValue={sub?.price ? sub.price > 0 ? sub.price : "" : ""}
                aria-describedby="maxQueriesDay-error"
              />
            </div>
            <div id="queriesCount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.price &&
                state.errors.price.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div> */}
      </div>
      {sub?.id && <ModalDeleteSubscription id={sub.id} open={open} handleOpen={handleOpen} />}
    </form >
  );
}
