import { ParsedData, Person, PersonField, personFields } from "./definitions";
import Papa from "papaparse";

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatQueryCondition = (
  query: any
) => {
  let result: string[] = [];
  try {
    const arrFields = JSON.parse(query);
    arrFields.map((item: any) => {
      Object.keys(item).map((key: string) => {
        for (const fld of personFields) {
          if (fld.name === key) {
            if (Object.keys(item[key])[0] === 'startsWith') {
              result.push(`${fld.title} начинается с "${item[key]['startsWith']}"`);
            }
          }
        }
      });
    })
  } catch (e) {
    console.log(e);
  }

  return result;
}

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

export async function uploadCsv(
  csvFile: string,
  config: PersonField[] | undefined = undefined,
  limitRows: number = -1,
  skipRows: number = 0
): Promise<ParsedData> {
  let persons: Person[] = [];
  let cols: string[] = [];
  let logs: string[] = [];

  return new Promise((resolve) => {
    logs.push(`Результаты предварительной обработки файла:`);
    let count = 0;
    Papa.parse<any>(csvFile, {
      worker: true,
      header: true,
      dynamicTyping: true,
      step: (results, parser) => {
        count++;
        if (skipRows < count) {
          cols = results.meta.fields ? results.meta.fields : [];
          if (config) {
            let person: Person = {};
            config.forEach((conf: PersonField) => {
              const val =
                results.data[`${conf.name}` as keyof typeof results.data];
              if (val) {
                person[`${conf.value}` as keyof typeof person] = val;
              }
            });
            persons.push(person);
            logs.push(`Запись: ${JSON.stringify(person)}`);
          } else {
            logs.push(`Строка: ${JSON.stringify(results.data)}`);
          }
        }
        if (limitRows === count) {
          parser.abort();
          resolve({ persons: persons, cols: cols, logs: logs });
        }
      },
      complete: (results) => {
        resolve({ persons: persons, cols: cols, logs: logs });
      },
    });
  });
}

export function formatString(s: string | null | undefined) {
  return s ? s.trim().toUpperCase() : null;
}

export function formatInt(s: number | string | bigint | null | undefined) {
  if (!s) return null;
  if (typeof s === "string") return parseInt(s);
  return s;
}

export function formatPhone(s: number | string | bigint | null | undefined) {
  if (!s) return null;
  const converStr = String(s);
  if (converStr.startsWith("8")) {
    const replaceStr = "7" + converStr.slice(1);
    return parseInt(replaceStr);
  }
  return parseInt(converStr);
}
