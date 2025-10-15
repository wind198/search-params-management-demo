import { parseSearchParamsMapFromUrl } from "@/helpers/parseSearchParamsMapFromUrl";
import { useQueryStore } from "../store/queryStore";
import { useEffect } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { buildQueryStringFromParamsMap } from "@/helpers/buildQueryStringFromParamsMap";

export function useSyncStoreAfterNavigateToUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  const updateQueryState = useQueryStore((s) => s.updateQueryState);
  /**
   * When URL change, might be on first load, router.push, router.replace or back
   * We need to synchronize the query store with the search params from the url
   */
  const synchroizeQueryStoreOnUrlChange = async (
    pathname: string,
    _searchParams: ReadonlyURLSearchParams
  ) => {
    const searchString = _searchParams.toString();
    const searchParams = parseSearchParamsMapFromUrl(searchString);

    // Override the query store with the search params from the url
    const newState = updateQueryState(pathname, searchParams);

    // Update the url with the new search params
    const searchParamToUpdateUrl = buildQueryStringFromParamsMap(newState);
    router.replace(`${pathname}?${searchParamToUpdateUrl}`);
  };

  useEffect(() => {
    synchroizeQueryStoreOnUrlChange(pathname, searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);
}
