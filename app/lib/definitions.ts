export type Person = {
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  iin?: bigint | null;
  phone?: bigint | null;
  region?: string | null;
  district?: string | null;
  locality?: string | null;
  street?: string | null;
  building?: string | null;
  apartment?: string | null;
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
