"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./db";
import { Person } from "./definitions";
import queue from "./queue";
import { saltAndHashPassword } from "./utils";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { CurrentUserType } from "@/authProvider";
import { fetchUserByEmail } from "./data";

const EXPIRED_PASSWORD_DAYS = 30;

export type LoginState = {
  user?: CurrentUserType;
  errors?: {
    email?: string;
    password?: string;
  };
  message?: string;
};

const signInSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Поле должно быть заполнено.",
    })
    .email("Некорректный почтовый ящик."),
  password: z.string().min(5, "Длина пароля не должен быть меньше 5 символов."),
});

const loginUser = signInSchema.omit({});

const CreateUserSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  email: z
    .string()
    .min(1, {
      message: "Поле должно быть заполнено.",
    })
    .email("Некорректный почтовый ящик"),
  password: z.string().min(5, {
    message: "Пароль должен состоять из не менее 5 символов.",
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
  queriesCount: z.number(),
  price: z.number(),
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
  };
  message?: string | null;
};

export type SubscriptionState = {
  errors?: {
    id?: string[];
    title?: string[];
    queriesCount?: string[];
    price?: string[];
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
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Пользователь не добавлен!",
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
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
        },
      });
    }
  } catch {
    return {
      message: "Ошибка в базе данных! Пользователь не обновлен!",
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function createSubscription(prevState: State, formData: FormData) {
  const validatedFields = CreateSubscription.safeParse({
    title: formData.get("title"),
    queriesCount: formData.get("queriesCount"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при добавлении подписки.",
    };
  }

  const { title, queriesCount, price } = validatedFields.data;

  try {
    await prisma.subscription.create({
      data: {
        title: title,
        queriesCount: queriesCount,
        price: price,
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Подписка не добавлена!",
    };
  }
  revalidatePath("/dashboard/subscriptions");
  redirect("/dashboard/subscriptions");
}

export async function updateSubscription(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateSubscription.safeParse({
    title: formData.get("title"),
    queriesCount: formData.get("queriesCount"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при изменении пользователя.",
    };
  }

  const { title, queriesCount, price } = validatedFields.data;

  try {
    await prisma.subscription.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        queriesCount: queriesCount,
        price: price,
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Подписка не обновлена!",
    };
  }
  revalidatePath("/dashboard/subscriptions");
  redirect("/dashboard/subscriptions");
}

export async function deleteSubscription(id: string) {
  await prisma.subscription.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard/subscriptions");
  redirect("/dashboard/subscriptions");
}

export async function createQuery(userId: string, body: string) {
  const query = await prisma.query.create({
    data: {
      userId: userId,
      body: body,
    },
  });

  await queue.add(
    "process-queries",
    {
      queryId: query.id,
    },
    { delay: 3000 }
  );

  return query;
}

export async function loadData(persons: Person[]) {
  await queue.add("load-data", {
    persons: persons,
  });
}

export async function login(formData: FormData) {
  const validatedFields = await loginUser.safeParseAsync({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Ошибка!",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    return { user: user };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Ошибка! Неверный логин или пароль.",
          };
        default:
          return {
            message: "Ошибка! Неверный логин или пароль.",
          };
      }
    }
    return {
      message: `Ошибка! ${error}`,
    };
  }
}

export async function logout() {
  await signOut();
  redirect("/dashboard");
}

export async function updateUserInfo() {
  const session = await auth();

  if (session?.user?.email) {
    return (await fetchUserByEmail(session.user.email)) || undefined;
  }
}
