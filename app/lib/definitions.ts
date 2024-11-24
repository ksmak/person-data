import { JsonObject } from "@prisma/client/runtime/library";

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