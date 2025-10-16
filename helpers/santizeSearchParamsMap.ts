import {
  DEFAULT_FILTER_PARAMS,
  DEFAULT_PAGINATION_PARAMS,
  DEFAULT_SORTS_PARAMS,
} from "@/config/queryConfig";
import { ISearchParamsMapPerPath } from "@/store/queryStore";
import {
  IApiParams,
  IFilterConfig,
  IPaginationConfig,
  ISortConfig,
} from "@/types/queryTypes";
import { cloneDeep } from "lodash-es";

/**
 * Sanitize the search params map
 * @param searchParamsMap - The search params map to sanitize
 * @param allowedParams - The allowed params
 * @returns The sanitized search params map
 */
export function sanitizeSearchParamsMap(
  searchParamsMap: ISearchParamsMapPerPath,
  allowedParams: readonly string[]
) {
  const output = {} as ISearchParamsMapPerPath;

  for (const [key, value] of Object.entries(searchParamsMap)) {
    if (allowedParams.includes(key)) {
      if (
        key === "filter" &&
        !checkInvalidApiParams(key as keyof IApiParams, value)
      ) {
        output[key] = cloneDeep(DEFAULT_FILTER_PARAMS);
        continue;
      }
      if (
        key === "pagination" &&
        !checkInvalidApiParams(key as keyof IApiParams, value)
      ) {
        output[key] = cloneDeep(DEFAULT_PAGINATION_PARAMS);
        continue;
      }
      if (
        key === "sorts" &&
        !checkInvalidApiParams(key as keyof IApiParams, value)
      ) {
        output[key] = cloneDeep(DEFAULT_SORTS_PARAMS);
        continue;
      }
      output[key] = value;
    }
  }

  return output;
}

export function checkInvalidApiParams(key: keyof IApiParams, value: unknown) {
  if (key === "pagination") {
    const v = value as IPaginationConfig;
    if (!v?.page || !v?.pageSize) {
      return false;
    }
    return true;
  }
  if (key === "sorts") {
    const v = value as ISortConfig[];
    if (
      !v ||
      v.some(
        (sort) =>
          !sort.key || !sort.order || !["asc", "desc"].includes(sort.order)
      )
    ) {
      return false;
    }
    return true;
  }
  if (key === "filter") {
    const v = value as IFilterConfig;
    if (!v) {
      return false;
    }
    return true;
  }
  return false;
}
