import {
  API_SEARCH_PARAMS_KEYS,
  DEFAULT_API_PARAMS,
  IPathConfig,
} from "@/config/queryConfig";
import { cloneDeep } from "lodash-es";
export type IProductAllowedParams =
  | (typeof API_SEARCH_PARAMS_KEYS)[number]
  | "tab"
  | "layout";

export const getProductsConfig = (): IPathConfig => ({
  allowedParams: [
    ...API_SEARCH_PARAMS_KEYS,
    "tab",
    "layout",
  ] satisfies IProductAllowedParams[],
  defaultParamValues: Object.freeze({
    ...cloneDeep(DEFAULT_API_PARAMS),
    layout: "grid",
    tab: "basic-info",
  }) satisfies Record<IProductAllowedParams, unknown>,
});
