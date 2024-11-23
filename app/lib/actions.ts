"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./db";
import { Person } from "./definitions";
import queue from "./queue";
import { saltAndHashPassword } from "./utils";

const EXPIRED_PASSWORD_DAYS = 30;

const CreateUserSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  email: z
    .string()
    .min(1, {
      message: "Поле должно быть заполнено",
    })
    .email("Некорректный почтовый ящик"),
  password: z.string().min(5, {
    message: "Пароль должен состоять из не менее 5 символов",
  }),
  lastName: z.string().refine((data) => data.trim() !== "", {
    message: "Поле не заполнено",
  }),
  firstName: z.string().refine((data) => data.trim() !== "", {
    message: "Поле не заполнено",
  }),
  middleName: z.string(),
  expiredPwd: z.date(),
  subsId: z.string().refine((data) => data.trim() !== "", {
    message: "Поле не заполнено",
  }),
});

const UpdateUserSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  email: z
    .string()
    .min(1, {
      message: "Поле должно быть заполнено",
    })
    .email("Некорректный почтовый ящик"),
  password: z.string(),
  lastName: z.string().refine((data) => data.trim() !== "", {
    message: "Поле не заполнено",
  }),
  firstName: z.string().refine((data) => data.trim() !== "", {
    message: "Поле не заполнено",
  }),
  middleName: z.string(),
  expiredPwd: z.date(),
  subsId: z.string().refine((data) => data.trim() !== "", {
    message: "Поле не заполнено",
  }),
});

const SubscriptionFormSchema = z.object({
  id: z.string(),
  title: z.string().refine((data) => data.trim() !== "", {
    message: "Поле ввода не заполнено",
  }),
  maxQueriesDay: z.coerce.number(),
  maxQueriesMonth: z.coerce.number(),
  maxQueriesTotal: z.coerce.number(),
  usageTimeLimit: z.coerce.number(),
  accessImportData: z.coerce.boolean(),
  accessUsers: z.coerce.boolean(),
  accessMonitoring: z.coerce.boolean(),
});

export type State = {
  errors?: {
    id?: string[];
    isActive?: string[];
    email?: string[];
    password?: string[];
    lastName?: string[];
    firstName?: string[];
    middleName?: string[];
    expiredPwd?: string[];
    subsId?: string[];
  };
  message?: string | null;
};

export type SubscriptionState = {
  errors?: {
    id?: string[];
    title?: string[];
    maxQueriesDay?: string[];
    maxQueriesMonth?: string[];
    maxQueriesTotal?: string[];
    usageTimeLimit?: string[];
    accessImportData?: string[];
    accessUsers?: string[];
    accessMonitoring?: string[];
  };
  message?: string | null;
};

export type ImportState = {
  file?: string;
  cols?: string[];
  persons?: Person[];
  error?: string | null;
  logs?: string[];
};

const CreateUser = CreateUserSchema.omit({
  id: true,
  isActive: true,
  expiredPwd: true,
});
const UpdateUser = UpdateUserSchema.omit({
  id: true,
  isActive: true,
  expiredPwd: true,
});
const CreateSubscription = SubscriptionFormSchema.omit({ id: true });
const UpdateSubscription = SubscriptionFormSchema.omit({ id: true });

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    isActive: formData.get("isActive"),
    email: formData.get("email"),
    password: formData.get("password"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
    subsId: formData.get("subsId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при добавлении пользователя.",
    };
  }

  const { email, password, lastName, firstName, middleName, subsId } =
    validatedFields.data;
  const now = new Date();
  const expiredPwd = new Date(
    now.setDate(now.getDate() + EXPIRED_PASSWORD_DAYS)
  );
  const isActive = !!formData.get("isActive");

  try {
    await prisma.user.create({
      data: {
        isActive: isActive,
        email: email,
        password: saltAndHashPassword(password),
        lastName: lastName,
        firstName: firstName,
        middleName: middleName,
        expiredPwd: expiredPwd,
        subsId: subsId,
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Пользователь не добавлен!",
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateUser.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
    subsId: formData.get("subsId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при изменении пользователя.",
    };
  }

  const { email, password, lastName, firstName, middleName, subsId } =
    validatedFields.data;
  const now = new Date();
  const expiredPwd = new Date(
    now.setDate(now.getDate() + EXPIRED_PASSWORD_DAYS)
  );
  const isActive = !!formData.get("isActive");

  try {
    if (password) {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          isActive: isActive,
          email: email,
          password: saltAndHashPassword(password),
          lastName: lastName,
          firstName: firstName,
          middleName: middleName,
          expiredPwd: expiredPwd,
          subsId: subsId,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          isActive: isActive,
          email: email,
          lastName: lastName,
          firstName: firstName,
          middleName: middleName,
          expiredPwd: expiredPwd,
          subsId: subsId,
        },
      });
    }
  } catch {
    return {
      message: "Ошибка в базе данных! Пользователь не обновлен!",
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/users");
  redirect("/users");
}

export async function createSubscription(prevState: State, formData: FormData) {
  const validatedFields = CreateSubscription.safeParse({
    title: formData.get("title"),
    maxQueriesDay: formData.get("maxQueriesDay"),
    maxQueriesMonth: formData.get("maxQueriesMonth"),
    maxQueriesTotal: formData.get("maxQueriesTotal"),
    usageTimeLimit: formData.get("usageTimeLimit"),
    accessImportData: formData.get("accessImportData"),
    accessUsers: formData.get("accessUsers"),
    accessMonitoring: formData.get("accessMonitoring"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при добавлении подписки.",
    };
  }

  const {
    title,
    maxQueriesDay,
    maxQueriesMonth,
    maxQueriesTotal,
    usageTimeLimit,
    accessImportData,
    accessMonitoring,
    accessUsers,
  } = validatedFields.data;

  try {
    await prisma.subscription.create({
      data: {
        title: title,
        maxQueriesDay: maxQueriesDay,
        maxQueriesMonth: maxQueriesMonth,
        maxQueriesTotal: maxQueriesTotal,
        usageTimeLimit: usageTimeLimit,
        accessImportData: accessImportData,
        accessUsers: accessUsers,
        accessMonitoring: accessMonitoring,
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Подписка не добавлена!",
    };
  }
  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}

export async function updateSubscription(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateSubscription.safeParse({
    title: formData.get("title"),
    maxQueriesDay: formData.get("maxQueriesDay"),
    maxQueriesMonth: formData.get("maxQueriesMonth"),
    maxQueriesTotal: formData.get("maxQueriesTotal"),
    usageTimeLimit: formData.get("usageTimeLimit"),
    accessImportData: formData.get("accessImportData"),
    accessUsers: formData.get("accessUsers"),
    accessMonitoring: formData.get("accessMonitoring"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при изменении пользователя.",
    };
  }

  const {
    title,
    maxQueriesDay,
    maxQueriesMonth,
    maxQueriesTotal,
    usageTimeLimit,
    accessImportData,
    accessMonitoring,
    accessUsers,
  } = validatedFields.data;

  try {
    await prisma.subscription.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        maxQueriesDay: maxQueriesDay,
        maxQueriesMonth: maxQueriesMonth,
        maxQueriesTotal: maxQueriesTotal,
        usageTimeLimit: usageTimeLimit,
        accessImportData: accessImportData,
        accessUsers: accessUsers,
        accessMonitoring: accessMonitoring,
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Подписка не обновлена!",
    };
  }
  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}

export async function deleteSubscription(id: string) {
  await prisma.subscription.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}

export async function createQuery(
  id: string,
  prevState: string | undefined,
  person: Person
) {
  let body: any[] = [];
  for (const key of Object.keys(person)) {
    const val = person[`${key}` as keyof typeof person];
    if (val) {
      const condition = {
        [`${key}`]: {
          startsWith: val,
          mode: "insensitive",
        },
      };
      body.push(condition);
    }
  }

  let query;
  try {
    query = await prisma.query.create({
      data: {
        userId: id,
        body: JSON.stringify(body),
        count: 0,
      },
    });
  } catch (error) {
    throw error;
  }

  return {
    query: query,
  };
}

export async function loadData(persons: Person[]) {
  await queue.add("load-data", {
    persons: persons,
  });
}
