import { ISearchParamsMapPerPath } from "@/store/queryStore";
import { isEqual } from "lodash-es";

/**
 * Remove the default values from a search params map
 * Useful to generate the search params map to show on the URL, keep the URL clean
 * @param searchParamsMap - The search params map to remove the default values from
 * @param defaultValues - The default values to remove from the search params map
 * @returns The search params map with the default values removed
 */
export function removeDefaultValuesFromSearchParamsMap(
  searchParamsMap: ISearchParamsMapPerPath,
  defaultValues: ISearchParamsMapPerPath
) {
  const output = {} as ISearchParamsMapPerPath;

  for (const [key, value] of Object.entries(searchParamsMap)) {
    if (!isEqual(value, defaultValues[key])) {
      output[key] = value;
    }
  }

  return output;
}
