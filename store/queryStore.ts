/**
 * Zustand store for query state management
 * Maintains query state per route and provides actions for updates
 */

import stringify from "json-sorted-stringify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import {
  DEFAULT_FILTER_PARAMS,
  DEFAULT_PAGINATION_PARAMS,
  DEFAULT_SORTS_PARAMS,
  getAllowedParams,
  getDefaultSearchParamsMap,
} from "../config/queryConfig";
import { cloneDeep, isEmpty, isEqual, merge } from "lodash-es";
import {
  checkInvalidApiParams,
  sanitizeSearchParamsMap,
} from "@/helpers/santizeSearchParamsMap";
import { usePathname } from "next/navigation";
import {
  IFilterConfig,
  IPaginationConfig,
  ISortConfig,
} from "@/types/queryTypes";
import { isNullOrUndefined } from "@/helpers/isNullOrUndefined";
import { allPaths, IAllPaths } from "@/config/allPaths";
import { useMemo } from "react";
import { parseSearchParamsMapFromUrl } from "@/helpers/parseSearchParamsMapFromUrl";
import { extractPathnameFromFullUrl } from "@/helpers/extractPathnameFromFullUrl";
export type ISearchParamsMapPerPath = Record<string, unknown>;

export type QueryStoreState = {
  /**
   * The query states per path, not include the default values
   */
  queryStates: Record<string, ISearchParamsMapPerPath>;
  /**
   * Whether the merge with the storage has been executed
   * if not, we store is incomplete, we return undefined for the api params
   * so cancel the API call
   */
  mergedWithStorage: boolean;
};

export type QueryStoreActions = {
  updateQueryState: (
    path: string,
    updates: Partial<ISearchParamsMapPerPath>
  ) => ISearchParamsMapPerPath;

  setParamsForPath: (
    path: string,
    key: string,
    value: unknown
  ) => ISearchParamsMapPerPath;
};

export const useQueryStore = create<QueryStoreState & QueryStoreActions>()(
  devtools(
    persist(
      // persist the query states to localStorage
      (set) => {
        const defaultQueryStates = Object.fromEntries(
          allPaths.map((key) => [key, {} as ISearchParamsMapPerPath])
        );
        const generateQueryStatesFromUrl = () => {
          const fullUrl = window.location.href;
          const searchParams = parseSearchParamsMapFromUrl(fullUrl);
          const pathname = extractPathnameFromFullUrl(fullUrl);
          return merge({}, defaultQueryStates, { [pathname]: searchParams });
        };
        return {
          // On SSR, use the default query states
          // On Client, use the query states from the url
          mergedWithStorage: false,
          queryStates:
            typeof window !== "undefined"
              ? generateQueryStatesFromUrl()
              : defaultQueryStates,

          updateQueryState: (
            path: string,
            updates: Partial<ISearchParamsMapPerPath>
          ) => {
            let newState: QueryStoreState;
            set((state: QueryStoreState) => {
              const updatedState = produce(state, (state: QueryStoreState) => {
                // only update the query state when the updates are not the same as the current state
                // query state trigger useEffect and hook refetch across the app, which is expensive
                const trueUpdatedValues = {} as ISearchParamsMapPerPath;
                for (const [key, value] of Object.entries(
                  // sanitize the api params if they are not valid
                  sanitizeSearchParamsMap(
                    updates,
                    getAllowedParams(path as IAllPaths)
                  )
                )) {
                  if (isEqual(value, state.queryStates[path][key])) {
                    continue;
                  }
                  trueUpdatedValues[key] = value;
                }
                if (isEmpty(trueUpdatedValues)) {
                  return;
                }
                for (const [key, value] of Object.entries(trueUpdatedValues)) {
                  if (isNullOrUndefined(value)) {
                    delete state.queryStates[path][key];
                    continue;
                  }
                  const defaultValues = getDefaultSearchParamsMap(
                    path as IAllPaths
                  );
                  if (isEqual(value, defaultValues[key])) {
                    delete state.queryStates[path][key];
                    continue;
                  }
                  state.queryStates[path][key] = value;
                }
              });
              newState = updatedState;
              return updatedState["queryStates"][path];
            });
            return newState!["queryStates"][path];
          },

          setParamsForPath: (path: string, key: string, value: unknown) => {
            let newState: QueryStoreState;
            set((state: QueryStoreState) => {
              const updatedState = produce(state, (state: QueryStoreState) => {
                // filter out the params that are not allowed
                if (!getAllowedParams(path as IAllPaths).includes(key)) {
                  return;
                }
                // sanitize the api params if they are not valid
                if (
                  key === "filter" &&
                  !checkInvalidApiParams("filter", value)
                ) {
                  value = cloneDeep(DEFAULT_FILTER_PARAMS);
                }
                if (
                  key === "pagination" &&
                  !checkInvalidApiParams("pagination", value)
                ) {
                  value = cloneDeep(DEFAULT_PAGINATION_PARAMS);
                }
                if (key === "sorts" && !checkInvalidApiParams("sorts", value)) {
                  value = cloneDeep(DEFAULT_SORTS_PARAMS);
                }

                // only update the query state when the new value are not the same as the current value
                // query state trigger useEffect and hook refetch across the app, which is expensive
                if (isEqual(value, state.queryStates[path][key])) {
                  return;
                }
                // can call setParamsForPath with undefined/null to delete the param
                // same as reset it to default value
                if (
                  isNullOrUndefined(value) &&
                  !isNullOrUndefined(state.queryStates[path][key])
                ) {
                  delete state.queryStates[path][key];
                  return;
                }
                const defaultValues = getDefaultSearchParamsMap(
                  path as IAllPaths
                );
                if (
                  isEqual(value, defaultValues[key]) &&
                  !isNullOrUndefined(state.queryStates[path][key])
                ) {
                  delete state.queryStates[path][key];
                  return;
                } else {
                  state.queryStates[path][key] = value;
                }
              });
              newState = updatedState;
              return updatedState;
            });
            return newState!["queryStates"][path];
          },
        };
      },
      {
        name: "query-store", // unique name for localStorage key

        merge(persistedState, currentState) {
          try {
            const mergedState = merge({}, persistedState, currentState);
            for (const [key, value] of Object.entries(
              mergedState.queryStates
            )) {
              mergedState.queryStates[key] = sanitizeSearchParamsMap(
                value,
                getAllowedParams(key as IAllPaths)
              );
            }
            const checkApiParams = (
              key: string,
              params: ISearchParamsMapPerPath
            ) => {
              const pagination = params?.pagination as IPaginationConfig;
              const sorts = params?.sorts as ISortConfig[];
              const filter = params?.filter as IFilterConfig;
              // Reset the api params if they are not valid
              if (filter && !checkInvalidApiParams("filter", filter)) {
                mergedState.queryStates[key].filter = cloneDeep(
                  DEFAULT_FILTER_PARAMS
                );
              }
              if (
                pagination &&
                !checkInvalidApiParams("pagination", pagination)
              ) {
                mergedState.queryStates[key].pagination = cloneDeep(
                  DEFAULT_PAGINATION_PARAMS
                );
              }
              if (sorts && !checkInvalidApiParams("sorts", sorts)) {
                mergedState.queryStates[key].sorts =
                  cloneDeep(DEFAULT_SORTS_PARAMS);
              }
            };
            for (const [key, value] of Object.entries(
              mergedState.queryStates
            )) {
              checkApiParams(key, value);
            }
            mergedState.mergedWithStorage = true;
            return mergedState;
          } catch (error) {
            console.error("Error merging query states", error);
            const output = merge({}, persistedState, {
              mergeExecuted: true,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return output as any;
          }
        },
      }
    ),
    {
      name: "query-store", // name for devtools
    }
  )
);

export function useApiParamsFromStore() {
  const pathname = usePathname();

  const _filter = useQueryStore((s) =>
    stringify(
      !s.mergedWithStorage
        ? undefined
        : s.queryStates[pathname]?.filter ||
            getDefaultSearchParamsMap(pathname).filter
    )
  );

  const _pagination = useQueryStore((s) =>
    stringify(
      !s.mergedWithStorage
        ? undefined
        : s.queryStates[pathname]?.pagination ||
            getDefaultSearchParamsMap(pathname).pagination
    )
  );

  const _sorts = useQueryStore((s) =>
    stringify(
      !s.mergedWithStorage
        ? undefined
        : s.queryStates[pathname]?.sorts ||
            getDefaultSearchParamsMap(pathname).sorts
    )
  );

  // Memoize the api params based on the stringified values to prevent excessive re-renders
  const filter = useMemo(
    () =>
      !isNullOrUndefined(_filter)
        ? (JSON.parse(_filter) as IFilterConfig)
        : undefined,
    [_filter]
  );
  const pagination = useMemo(
    () =>
      !isNullOrUndefined(_pagination)
        ? (JSON.parse(_pagination) as IPaginationConfig)
        : undefined,
    [_pagination]
  );
  const sorts = useMemo(
    () =>
      !isNullOrUndefined(_sorts)
        ? (JSON.parse(_sorts) as ISortConfig[])
        : undefined,
    [_sorts]
  );
  return { filter, pagination, sorts };
}
