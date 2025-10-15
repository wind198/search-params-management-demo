"use client";

import { useApiParamsFromStore, useQueryStore } from "@/store/queryStore";
import { usePathname } from "next/navigation";
import { ISortConfig } from "@/types/queryTypes";
import { useUpdateUrlAfterUpdateQueryState } from "@/hooks/useUpdateUrlAfterUpdateQueryState";
import { useCallback, useMemo } from "react";
import { keyBy } from "lodash-es";

interface SortOption {
  key: string;
  label: string;
}

interface DataSortingProps {
  sortOptions: SortOption[];
}

export function DataSorting({ sortOptions }: DataSortingProps) {
  const pathname = usePathname();
  const { sorts = [] } = useApiParamsFromStore();

  const getSortOrder = useCallback(
    (key: string) => {
      const sort =
        sorts?.find((s: ISortConfig) => s.key === key)?.order ?? null;

      return sort;
    },
    [sorts]
  );

  const sortMap = useMemo(() => {
    return keyBy(
      sortOptions.map(({ key, label }) => {
        const order = getSortOrder(key);
        return { key, label, order };
      }),
      (i) => i.key
    );
  }, [getSortOrder, sortOptions]);

  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);
  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();

  const setSort = (key: string, order: "asc" | "desc") => {
    const existingSortIndex = sorts.findIndex(
      (s: ISortConfig) => s.key === key
    );
    let newSorts;

    if (existingSortIndex >= 0) {
      newSorts = [...sorts];
      newSorts[existingSortIndex] = { key, order };
    } else {
      newSorts = [...sorts, { key, order }];
    }

    const newState = setParamsForPath(pathname, "sorts", newSorts);
    onQueryStateChange(newState);
  };

  const removeSort = (key: string) => {
    const newSorts = sorts.filter((s: ISortConfig) => s.key !== key);
    const newState = setParamsForPath(pathname, "sorts", newSorts);
    onQueryStateChange(newState);
  };

  const clearSorts = () => {
    const newState = setParamsForPath(pathname, "sorts", []);
    onQueryStateChange(newState);
  };

  const toggleSortOrder = (key: string) => {
    const currentOrder = sortMap[key]?.order ?? null;
    const nextOrder =
      currentOrder === "asc" ? "desc" : currentOrder === "desc" ? null : "asc";

    if (!nextOrder) {
      removeSort(key);
    } else {
      setSort(key, nextOrder);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>

      <div className="flex gap-2">
        {Object.values(sortMap).map(({ key, label, order }) => {
          return (
            <button
              key={key}
              onClick={() => toggleSortOrder(key)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                order
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
              {order && (
                <span className="ml-1">{order === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          );
        })}
      </div>

      {sorts.length > 0 && (
        <button
          onClick={clearSorts}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
