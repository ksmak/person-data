"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./db";
import { Person } from "./definitions";
// import queue from "./queue";
import bcrypt from "bcrypt";

const EXPIRED_PASSWORD_DAYS = 30;

const salt = 10;

const CreateUserSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  login: z.string().min(3, {
    message: "Логин должен состоять из не менее 3 символов",
  }),
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
  login: z.string().min(3, {
    message: "Логин должен состоять из не менее 3 символов",
  }),
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
    login?: string[];
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
        password: bcrypt.hashSync(password, salt),
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
    if (password) {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          isActive: isActive,
          login: login,
          password: bcrypt.hashSync(password, salt),
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
          login: login,
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
  let body: any = [];
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

export async function loadData(persons: Person[], prevState: ImportState) {
  // const job = await queue.add("load-data", {
  //   persons: persons,
  // });
  let logs = [];
  // let persons = [];
  let error = false;

  logs.push(`Начат процесс загрузки данных...`);
  for (const person of persons) {
    if (person.iin) {
      try {
        const findPersonByIin = await prisma.person.findFirst({
          where: {
            dbId: person.dbId,
            iin: String(person.iin),
          },
        });
        if (findPersonByIin) {
          try {
            const p = await prisma.person.update({
              data: {
                firstName: person.firstName,
                lastName: person.lastName,
                middleName: person.middleName,
                phone: person.phone,
                region: person.region,
                district: person.district,
                building: person.building,
                apartment: person.apartment,
                extendedPersonData: person.extendedPersonData,
              },
              where: {
                id: findPersonByIin.id,
              },
            });
            logs.push(`Обновление: ${JSON.stringify(p)}`);
          } catch (e) {
            error = true;
            logs.push(`Ошибка при обновлении! (${person.iin})! ${e}`);
          }
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(`Ошибка при проверке ИИН! (${person.iin})! ${e}`);
      }
      continue;
    }
    if (person.firstName && person.lastName) {
      try {
        const findPersonByFIO = await prisma.person.findFirst({
          where: {
            dbId: person.dbId,
            firstName: person.firstName,
            lastName: person.lastName,
            middleName: person.middleName,
          },
        });
        if (findPersonByFIO) {
          try {
            const p = await prisma.person.update({
              data: {
                iin: String(person.iin),
                phone: person.phone,
                region: person.region,
                district: person.district,
                building: person.building,
                apartment: person.apartment,
                extendedPersonData: person.extendedPersonData,
              },
              where: {
                id: findPersonByFIO.id,
              },
            });
            logs.push(`Обновление: ${JSON.stringify(p)}`);
          } catch (e) {
            error = true;
            logs.push(
              `Ошибка при обновлении! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
            );
          }
          continue;
        }
      } catch (e) {
        error = true;
        logs.push(
          `Ошибка при проверке ФИО! (${person.lastName} ${person.firstName} ${person.middleName})! ${e}`
        );
      }
      continue;
    }
    try {
      const p = await prisma.person.create({
        data: {
          dbId: person.dbId,
          firstName: person.firstName,
          lastName: person.lastName,
          middleName: person.middleName,
          iin: String(person.iin),
          phone: person.phone,
          region: person.region,
          district: person.district,
          building: person.building,
          apartment: person.apartment,
          extendedPersonData: person.extendedPersonData,
        },
      });
      logs.push(`Вставка: ${JSON.stringify(p)}`);
    } catch (e) {
      error = true;
      logs.push(`Ошибка при вставке! (${JSON.stringify(person)})! ${e}`);
    }
  }
  logs.push(`Загрузка данных завершена.`);

  if (error) {
    return {
      error: "В ходе загрузки данных возникли некоторые ошибки.",
      logs: logs,
    };
  }

  return {
    logs: logs,
  };
}
