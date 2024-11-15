import { Person } from "./definitions";
import Papa, { ParseError, ParseResult } from 'papaparse';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string | null,
  locale: string = 'en-US',
) => {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
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
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export async function uploadCsv(csvFile: File, formData: FormData | undefined = undefined) {
  let persons: Person[] = [];
  let cols: string[] = [];

  return new Promise(resolve => {
    Papa.parse<any>(csvFile, {
      header: true,
      dynamicTyping: true,
      step: (results) => {
        if (formData) {
          cols = results.meta.fields ? results.meta.fields : [];
          let person: Person = {};
          results.meta.fields?.forEach(element => {
            const field = formData.get(`${element}`);
            const val = results.data[`${element}` as keyof typeof results.data];
            if (field && val) {
              person[`${field}` as keyof typeof person] = val;
            }
          });
          persons.push(person);
        }
      },
      complete: () => {
        resolve({ persons: persons, cols: cols });
      }
    });
  });
}