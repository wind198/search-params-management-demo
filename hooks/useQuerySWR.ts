import useSWR from "swr";
import { IApiParams } from "@/types/queryTypes";
import { buildQueryStringFromParamsMap } from "@/helpers/buildQueryStringFromParamsMap";
import { IPaginatedData } from "@/types/paginatedData";

// Fetcher function for SWR
const fetcher = (url: string) => {
  console.log("fetching with key", url);
  return fetch(url).then((res) => res.json());
};

// Generic SWR hook for any API endpoint
export function useQuerySWR<T>(
  endpoint: string,
  apiParams: Partial<IApiParams>,
  options?: {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    dedupingInterval?: number;
  }
) {
  const filter = apiParams.filter;
  const pagination = apiParams.pagination;
  const sorts = apiParams.sorts;

  // Build the query string from the API params
  const queryString = buildQueryStringFromParamsMap({
    filter,
    pagination,
    sorts,
  });

  // Create the SWR key
  const key = `${endpoint}?${queryString}`;

  // Use SWR with the same key pattern as the fallback data
  const { data, error, isLoading, mutate } = useSWR<IPaginatedData<T>>(
    key,
    fetcher,
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? false,
      revalidateOnReconnect: options?.revalidateOnReconnect ?? true,
      dedupingInterval: options?.dedupingInterval ?? 2000, // Dedupe requests for 2 seconds
      // Only perform fetch on mount when the api params are all defined
      revalidateOnMount: Boolean(filter && pagination && sorts),
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
