import { User } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";

export const EXPIRED_PASSWORD_DAYS = 30;
export const ITEMS_PER_PAGE = 8;

export const searchSchema = z.object({
  body: z.string().min(4, {
    message: "Для поиска необходимо хотя бы 4 символа",
  }),
  photo: z.string(),
});

export const search = searchSchema.omit({
  photo: true,
});

export type LoginState = {
  user?: User;
  errors?: {
    email?: string;
    password?: string;
  };
  message?: string;
};

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Поле должно быть заполнено.",
    })
    .email("Некорректный почтовый ящик."),
  password: z.string().min(5, "Длина пароля не должен быть меньше 5 символов."),
});

export const loginUser = signInSchema.omit({});

export const CreateUserSchema = z.object({
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
  balance: z.number().positive(),
});

export const UpdateUserSchema = z.object({
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
  balance: z.number().positive(),
});

export const SubscriptionFormSchema = z.object({
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
    balance?: string[];
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

export const CreateUser = CreateUserSchema.omit({
  id: true,
  isActive: true,
});
export const UpdateUser = UpdateUserSchema.omit({
  id: true,
  isActive: true,
});
export const CreateSubscription = SubscriptionFormSchema.omit({
  id: true,
});
export const UpdateSubscription = SubscriptionFormSchema.omit({
  id: true,
});

export const PERSONS_FIELDS_LIST = `
    "Person"."iin",
    "Person"."phone",
    "Person"."lastName",
    "Person"."firstName",
    "Person"."middleName",
    "Person"."region",
    "Person"."district",
    "Person"."street",
    "Person"."locality",
    "Person"."building",
    "Person"."apartment",
    "Person"."extendedPersonData"
`;
export const PERSONS_FULLTEXT_EXP = `
    COALESCE("Person"."iin", '') || ' ' || 
    COALESCE("Person"."phone", '') || ' ' || 
    COALESCE("Person"."lastName", '') || ' ' || 
    COALESCE("Person"."firstName", '') || ' ' || 
    COALESCE("Person"."middleName", '') || ' ' || 
    COALESCE("Person"."region", '') || ' ' || 
    COALESCE("Person"."district", '') || ' ' || 
    COALESCE("Person"."street", '') || ' ' || 
    COALESCE("Person"."locality", '') || ' ' || 
    COALESCE("Person"."building", '') || ' ' || 
    COALESCE("Person"."apartment", '')
`;

export type PersonResult = {
  db_name: string | null;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  iin: string | null;
  phone: string | null;
  region: string | null;
  district: string | null;
  locality: string | null;
  street: string | null;
  building: string | null;
  apartment: string | null;
  extendedPersonData: string | null;
};

export type Person = {
  db?: { id: string; name: string } | null;
  dbId?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  iin?: string | null;
  phone?: string | null;
  region?: string | null;
  district?: string | null;
  locality?: string | null;
  street?: string | null;
  building?: string | null;
  apartment?: string | null;
  extendedPersonData?: JsonObject;
};

export type PersonField = {
  name: string;
  title: string;
  value?: string;
};

export type ParsedData = {
  persons: Person[];
  cols: string[];
  logs: string[];
};

export const personFields: PersonField[] = [
  { name: "lastName", title: "Фамилия" },
  { name: "firstName", title: "Имя" },
  { name: "middleName", title: "Отчество" },
  { name: "iin", title: "ИИН" },
  { name: "phone", title: "Номер телефона" },
  { name: "region", title: "Область" },
  { name: "district", title: "Район" },
  { name: "locality", title: "Населенный пункт" },
  { name: "street", title: "Улица" },
  { name: "building", title: "Дом" },
  { name: "apartment", title: "Квартира" },
];

export type TableHead = {
  title: string;
  name: string;
  fieldType:
    | "string"
    | "boolean"
    | "date"
    | "datetime"
    | "active"
    | "nested"
    | "queryBody"
    | "queryState";
  nestedName?: string;
};

export type UsersQueries = {
  id: string;
  fio: string;
  queries_day: number;
  queries_month: number;
  queries_total: number;
};

export type MessageChat = {
  role: string;
  content: string;
};

export type Result = {
  data: any;
  service: "Qarau API" | "UsersBox API" | "Search4Faces API";
  error?: string;
};

export type ResultField = {
  title: string;
  value: string;
  href?: string;
};
