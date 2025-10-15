"use client";

import { DataSorting } from "@/components/common/DataSorting";

export function UsersSorting() {
  const sortOptions = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return <DataSorting sortOptions={sortOptions} />;
}
