"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./db";
import {
  CreateSubscription,
  CreateUser,
  loginUser,
  Person,
  State,
  UpdateSubscription,
  UpdateUser
} from "@/app/lib/definitions";
import queue from "./queue";
import { saltAndHashPassword } from "./utils";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    isActive: formData.get("isActive"),
    email: formData.get("email"),
    password: formData.get("password"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при добавлении пользователя.",
    };
  }

  const { email, password, lastName, firstName, middleName } =
    validatedFields.data;

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
      },
    });
  } catch {
    return {
      message: "Ошибка в базе данных! Пользователь не добавлен!",
    };
  }

  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users");
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Возникли ошибки при изменении пользователя.",
    };
  }

  const { email, password, lastName, firstName, middleName } =
    validatedFields.data;

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
        },
      });
    }
  } catch {
    return {
      message: "Ошибка в базе данных! Пользователь не обновлен!",
    };
  }

  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users");
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
  revalidatePath("/dashboard/admin/subscriptions");
  redirect("/dashboard/admin/subscriptions");
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
  revalidatePath("/dashboard/admin/subscriptions");
  redirect("/dashboard/admin/subscriptions");
}

export async function deleteSubscription(id: string) {
  await prisma.subscription.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard/admin/subscriptions");
  redirect("/dashboard/admin/subscriptions");
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
