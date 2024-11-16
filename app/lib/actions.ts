"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./db";
import { uploadCsv } from "@/app/lib/utils";
import fs from "fs/promises";
import fss from "node:fs";
import { ParsedData, Person, PersonField } from "./definitions";
import { error } from "console";

const EXPIRED_PASSWORD_DAYS = 30;

const FormSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  login: z.string().min(3, {
    message: "Логин должен состоять из не менее 3 символов",
  }),
  password: z.string(),
  lastName: z.string().refine((data) => data.trim() !== "", {
    message: "Поле ввода не заполнено",
  }),
  firstName: z.string().refine((data) => data.trim() !== "", {
    message: "Поле ввода не заполнено",
  }),
  middleName: z.string(),
  expiredPwd: z.date(),
  subsId: z.string(),
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
    login?: string[];
    password?: string[];
    lastName?: string[];
    firstName?: string[];
    middleName?: string[];
    expiredPwd?: string[];
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

const CreateUser = FormSchema.omit({
  id: true,
  isActive: true,
  expiredPwd: true,
});
const UpdateUser = FormSchema.omit({
  id: true,
  isActive: true,
  expiredPwd: true,
});
const CreateSubscription = SubscriptionFormSchema.omit({ id: true });
const UpdateSubscription = SubscriptionFormSchema.omit({ id: true });

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    isActive: formData.get("isActive"),
    login: formData.get("login"),
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

  const { login, password, lastName, firstName, middleName, subsId } =
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
        login: login,
        password: password,
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
    login: formData.get("login"),
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

  const { login, password, lastName, firstName, middleName, subsId } =
    validatedFields.data;
  const now = new Date();
  const expiredPwd = new Date(
    now.setDate(now.getDate() + EXPIRED_PASSWORD_DAYS)
  );
  const isActive = !!formData.get("isActive");

  try {
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
        subsId: subsId,
      },
    });
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
  formData: FormData
) {
  let body: any = [];
  for (const pair of formData.entries()) {
    if (pair[1]) {
      const condition = {
        [`${pair[0]}`]: {
          startsWith: `${pair[1]}`,
          mode: "insensitive",
        },
      };
      body.push(condition);
    }
  }

  try {
    const persons = prisma.person.findMany({
      where: {
        OR: [...body],
      },
    });

    await prisma.query.create({
      data: {
        userId: id,
        body: JSON.stringify(body),
        count: (await persons).length,
      },
    });
  } catch (error) {
    throw error;
  }
  revalidatePath("/queries");
  redirect("/queries");
}

export async function uploadFile(prevState: ImportState, formData: FormData) {
  const dataFile = formData.get("file") as File;

  const extension = dataFile.name.split('.').at(-1);
  if (extension !== 'csv') {
    return {
      file: dataFile.name,
      error: "Ошибка формата файла! Для загрузки данных необходимы файлы с расширением csv",
    }
  };

  const buffer = await dataFile.arrayBuffer();
  const dataBuffer = Buffer.from(buffer);
  await fs.writeFile(`uploads/${dataFile.name}`, dataBuffer);

  const file = fss.readFileSync(`uploads/${dataFile.name}`, 'utf8');

  const parseData: ParsedData = await uploadCsv(file);

  return {
    file: dataFile.name,
    cols: parseData.cols,
    logs: parseData.logs,
  }
}

export async function previewData(params: { fileName: string | undefined, cols: string[] }, prevState: ImportState, formData: FormData) {
  if (!params.fileName) {
    return {
      error: "Ошибка! Файл не выбран!"
    }
  }
  const file = fss.readFileSync(`uploads/${params.fileName}`, 'utf8');

  let config: PersonField[] = [];
  params.cols.forEach((item: string) => {
    const field = formData.get(item);
    if (field) {
      config.push({
        name: item,
        title: item,
        value: field,
      } as PersonField);
    }
  })

  console.log(config);

  const parseData: ParsedData = await uploadCsv(file, config);

  return {
    file: params.fileName,
    cols: parseData.cols,
    persons: parseData.persons,
    logs: parseData.logs,
  }
}

export async function loadData(params: { fileName: string | undefined, cols: string[], persons: Person[] }, prevState: ImportState) {
  try {
    await prisma.person.createMany({
      data: params.persons,
      skipDuplicates: true,
    });
    return {
      file: params.fileName,
      cols: params.cols,
      persons: params.persons,
      logs: ['Данные успешно загружены.'],
    }
  } catch (error) {
    throw error;
  }
}