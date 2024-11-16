export type Person = {
  fullName?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  iin?: string;
  phone?: string;
  region?: string;
  district?: string;
  locality?: string;
  street?: string;
  building?: string;
  apartment?: number;
};

export type PersonField = {
  name: string;
  title: string;
  value?: string;
};

export type ParsedData = {
  persons: Person[],
  cols: string[],
  logs: string[],
}
