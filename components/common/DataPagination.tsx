"use client";

import { IAllPaths } from "@/config/allPaths";
import { useQueryStore } from "@/store/queryStore";
import { usePathname } from "next/navigation";
import { IPaginatedData } from "@/types/paginatedData";
import { useUpdateUrlAfterUpdateQueryState } from "@/hooks/useUpdateUrlAfterUpdateQueryState";
import { Pagination } from "./Pagination";
import { IPaginationConfig } from "@/types/queryTypes";

interface DataPaginationProps<T> {
  pageSizeOptions?: number[];
  data?: IPaginatedData<T>;
}

export function DataPagination<T>({
  pageSizeOptions = [10, 20, 25, 50, 100],
  data,
}: DataPaginationProps<T>) {
  const pathname = usePathname();
  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);
  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();

  // Extract pagination data from the props
  const currentPage = data?.pagination?.page || 1;
  const currentPageSize = data?.pagination?.pageSize || 10;
  const totalItems = data?.total || 0;

  const handlePageChange = (page: number) => {
    const newState = setParamsForPath(pathname as IAllPaths, "pagination", {
      page,
      pageSize: currentPageSize,
    } satisfies IPaginationConfig);
    onQueryStateChange(newState);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newState = setParamsForPath(pathname as IAllPaths, "pagination", {
      page: currentPage,
      pageSize: newPageSize,
    } satisfies IPaginationConfig);
    onQueryStateChange(newState);
  };

  if (!data?.data || !data?.data?.length) return null;

  return (
    <Pagination
      currentPage={currentPage}
      currentPageSize={currentPageSize}
      totalItems={totalItems}
      pageSizeOptions={pageSizeOptions}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
