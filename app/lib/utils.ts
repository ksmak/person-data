import { personFields } from "./definitions";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatQueryCondition = (query: any) => {
  let result: string[] = [];
  try {
    const arrFields = JSON.parse(query);
    arrFields.map((item: any) => {
      Object.keys(item).map((key: string) => {
        for (const fld of personFields) {
          if (fld.name === key) {
            if (Object.keys(item[key])[0] === "startsWith") {
              result.push(
                `${fld.title} начинается с "${item[key]["startsWith"]}"`
              );
            }
          }
        }
      });
    });
  } catch (e) {
    console.log(e);
  }

  return result;
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function formatStr(s: any) {
  let str: string = String(s).trim().toUpperCase();
  if (str === "NULL") return null;
  const removingSymbols = [
    " ",
    "!",
    "@",
    "#",
    "%",
    "^",
    "&",
    "*",
    "-",
    "+",
    "<",
    ">",
    "=",
    "/",
    "(",
    ")",
  ];
  for (let i = 0; i > removingSymbols.length; i++) {
    str = str.replaceAll(removingSymbols[i], "");
  }
  return str;
}

export function formatPhone(s: any) {
  const converStr = formatStr(s);
  if (s === null) return null;
  if (String(converStr).startsWith("8")) {
    return "7" + String(converStr).slice(1);
  }
  return converStr;
}

export function saltAndHashPassword(password: string) {
  return bcrypt.hashSync(password, salt);
}

export function comparePasswords(pwd1: string, pwd2: string) {
  return bcrypt.compareSync(pwd1, pwd2);
}
