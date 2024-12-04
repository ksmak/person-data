import { personFields, PersonResult, Result, ResultField } from "./definitions";
import bcrypt from "bcryptjs";
import { fieldHelper } from "./fields";

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
  const result: string[] = [];
  try {
    const arrFields = JSON.parse(query);
    arrFields.map((item: any) => {
      Object.keys(item).map((key: string) => {
        for (const fld of personFields) {
          if (fld.name === key) {
            if (Object.keys(item[key]).length > 0) {
              switch (Object.keys(item[key])[0]) {
                case "contains": {
                  result.push(
                    `${fld.title} содержит "${item[key]["contains"]}"`
                  );
                  break;
                }
                case "startsWith": {
                  result.push(
                    `${fld.title} начинается с "${item[key]["startsWith"]}"`
                  );
                  break;
                }
                case "endsWith": {
                  result.push(
                    `${fld.title} оканчивается на "${item[key]["endsWith"]}"`
                  );
                  break;
                }
                default: {
                  result.push(`${fld.title} равно "${item[key]}"`);
                }
              }
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

export function getCondition(key: string, val: string) {
  const replaceVal = val
    .replaceAll("*", "%")
    .replaceAll("?", "_")
    .toUpperCase();

  if (replaceVal.startsWith("%") && replaceVal.endsWith("%")) {
    const formattedVal = replaceVal.substring(1, val.length - 1);
    return {
      [`${key}`]: {
        contains: formattedVal,
        mode: "insensitive",
      },
    };
  } else if (replaceVal.startsWith("%")) {
    const formattedVal = replaceVal.substring(1);
    return {
      [`${key}`]: {
        endsWith: formattedVal,
        mode: "insensitive",
      },
    };
  } else if (replaceVal.endsWith("%")) {
    const formattedVal = replaceVal.substring(0, val.length - 1);
    return {
      [`${key}`]: {
        startsWith: formattedVal,
        mode: "insensitive",
      },
    };
  } else if (replaceVal.includes("%") || replaceVal.includes("_")) {
    return {
      [`${key}`]: {
        contains: replaceVal,
        mode: "insensitive",
      },
    };
  }

  //default
  return {
    [`${key}`]: replaceVal,
  };
}

export function getResults(result: Result): ResultField[] {
  const obj: ResultField[] = [];

  switch (result.service) {
    case 'Qarau API': {
      try {
        const data = result.data as PersonResult;
        obj.push({ title: 'База данных', value: data.db_name || '' });
        obj.push({ title: 'Ф.И.О', value: `${data.lastName || ''} ${data.firstName || ''} ${data.middleName || ''}` });
        obj.push({ title: 'ИИН', value: data.iin || '' });
        obj.push({ title: 'Номер', value: data.phone || '' });
        obj.push({ title: 'Адрес', value: '' });
        obj.push({ title: 'Область/Регион', value: data.region || '' });
        obj.push({ title: 'Район', value: data.district || '' });
        obj.push({ title: 'Населенный пункт', value: data.locality || '' });
        obj.push({ title: 'Улица/Микрорайон', value: data.street || '' });
        obj.push({ title: 'Дом', value: data.building || '' });
        obj.push({ title: 'Квартира', value: data.apartment || '' });
        obj.push({ title: 'Дополнительная информация', value: '' });
        if (!!data.extendedPersonData) {
          Object.keys(data.extendedPersonData).map((key: string) => {
            if (data.extendedPersonData && data.extendedPersonData[`${key}` as keyof typeof data.extendedPersonData]) {
              obj.push({
                title: key,
                value: data.extendedPersonData[`${key}` as keyof typeof data.extendedPersonData]
                  ? String(data.extendedPersonData[`${key}` as keyof typeof data.extendedPersonData]) : '',
              })
            }
          });
        };
      } catch (e) {
        console.log(e);
      }
      break;
    }

    case 'UsersBox API': {
      try {
        obj.push({ title: 'База данных', value: result.data?.source?.database || '' });
        obj.push({ title: 'Коллекция', value: result.data?.source?.collection || '' });
        if (result.data?.hits?.items) {
          result.data.hits.items.map((item: any) => {
            Object.keys(item).map((k: string) => {
              if (fieldHelper[`${k}` as keyof typeof fieldHelper]) {
                if (typeof item[`${k}`] === 'object') {
                  obj.push({ title: fieldHelper[`${k}` as keyof typeof fieldHelper], value: JSON.stringify(item[`${k}`]) });
                } else {
                  obj.push({ title: fieldHelper[`${k}` as keyof typeof fieldHelper], value: item[`${k}`] || '' });
                }
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
      }
      break;
    }
  }
  return obj;
}