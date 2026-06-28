export enum FilterType {
  EQUALS = "equals",
  CONTAINS = "contains",
  STARTS_WITH = "startsWith",
  ENDS_WITH = "endsWith",
  IN = "in",
  NOT = "not",
  GTE = "gte",
  LTE = "lte",
  NOT_NULL = "notNull",
}

export type PrismaFilter = Record<
  string,
  { [key in FilterType]?: string | number | string[] | boolean | null }
>;

export type Option = {
  field: string;
  value: string | number | string[];
  filterType: FilterType;
};
