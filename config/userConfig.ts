import { cloneDeep } from "lodash-es";
import { IPathConfig } from "./queryConfig";
import { API_SEARCH_PARAMS_KEYS } from "./queryConfig";
import { DEFAULT_API_PARAMS } from "./queryConfig";

export type IUserAllowedParams =
  | (typeof API_SEARCH_PARAMS_KEYS)[number]
  | "layout"
  | "tab";

export const getUsersConfig = (): IPathConfig => ({
  allowedParams: [
    ...API_SEARCH_PARAMS_KEYS,
    "layout",
    "tab",
  ] satisfies IUserAllowedParams[],
  defaultParamValues: Object.freeze({
    ...cloneDeep(DEFAULT_API_PARAMS),
    layout: "table",
    tab: "profile",
  }) satisfies Record<IUserAllowedParams, unknown>,
});
