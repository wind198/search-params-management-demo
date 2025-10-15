import { ISearchParamsMapPerPath } from "@/store/queryStore";

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
      output[key] = value;
    }
  }

  return output;
}
