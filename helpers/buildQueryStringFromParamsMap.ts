import { ISearchParamsMapPerPath } from "@/store/queryStore";
import { stringify } from "qs";

/**
 * Build a query string from a params map
 * Useful for URL preparation for SWR and API calls
 * @param paramsMap - The params map to build the query string from
 * @returns The query string
 */
export function buildQueryStringFromParamsMap(
  paramsMap: ISearchParamsMapPerPath
) {
  return stringify(paramsMap, { addQueryPrefix: false });
}
