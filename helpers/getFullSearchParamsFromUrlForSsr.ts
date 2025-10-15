import { merge } from "lodash-es";
import { parseSearchParamsMapFromUrl } from "./parseSearchParamsMapFromUrl";
import { extractPathnameFromFullUrl } from "@/helpers/extractPathnameFromFullUrl";
import {
  getAllowedParams,
  getDefaultSearchParamsMap,
} from "@/config/queryConfig";
import { sanitizeSearchParamsMap } from "@/helpers/santizeSearchParamsMap";

/**
 * Get the full search params from a url for SSR, include the default value params
 * Useful to generate API call URL
 * @param url - The url to get the full search params from
 * @returns The full search params
 */
export function getFullSearchParamsFromUrlForSsr(url: string) {
  const pathname = extractPathnameFromFullUrl(url);
  const defaultParams = getDefaultSearchParamsMap(pathname);
  const searchParamsMapFromUrl = parseSearchParamsMapFromUrl(url);

  const fullSearchParams = merge(
    {},
    defaultParams,
    sanitizeSearchParamsMap(searchParamsMapFromUrl, getAllowedParams(pathname))
  );

  return fullSearchParams;
}
