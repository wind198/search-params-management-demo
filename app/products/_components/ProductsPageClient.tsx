"use client";

import { useApiParamsFromStore } from "@/store/queryStore";
import { useQuerySWR } from "@/hooks/useQuerySWR";

import { ProductsList } from "./ProductsList";
import { DataPagination } from "@/components/common/DataPagination";
import { Product } from "@/mock/products";

export function ProductsPageClient() {
  const { filter, pagination, sorts } = useApiParamsFromStore();

  // Call the SWR hook once
  const { data, error, isLoading } = useQuerySWR<Product>("/api/products", {
    filter,
    pagination,
    sorts,
  });

  return (
    <>
      <ProductsList data={data} error={error} isLoading={isLoading} />
      {error || isLoading ? null : (
        <DataPagination<Product>
          data={data}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      )}
    </>
  );
}
