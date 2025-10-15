import { parse } from "qs";
// @ts-expect-error query-types is not typed
import { parseObject } from "query-types";

/**
 * Parse the search params map from a url
 * Can be used on both client and server
 * Give use the same format of params stored in zustand from the URL
 * @param url - The url to parse the search params map from
 * @returns The search params map
 */
export function parseSearchParamsMapFromUrl(url: string) {
  if (url.includes("#")) {
    url = url.split("#")[0];
  }
  const x = url.replace(/^https?:\/\/[^\/]+/, "");
  const firstQuestionMarkIndex = x.indexOf("?");
  let query = x;
  if (firstQuestionMarkIndex > -1) {
    query = x.substring(firstQuestionMarkIndex + 1);
  }
  const raw = parse(query);
  const parsed = parseObject(raw);
  return parsed;
}
