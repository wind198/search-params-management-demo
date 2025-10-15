"use client";

import { DataSorting } from "@/components/common/DataSorting";

export function ProductsSorting() {
  const sortOptions = [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
  ];

  return <DataSorting sortOptions={sortOptions} />;
}
