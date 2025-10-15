/**
 * Core types for the SSR Query State Manager
 */

// Base types for query parameters
export type SortOrder = "asc" | "desc";

export type ISeachParamValue = string | number | boolean | string[] | number[];

export type ISortConfig = {
  key: string;
  order: SortOrder;
};

export type IPaginationConfig = {
  page: number;
  pageSize: number;
};

export type IFilterConfig = {
  [key: string]: unknown;
};

export type IApiParams = {
  pagination: IPaginationConfig;
  sorts: ISortConfig[];
  filter: IFilterConfig;
};
