"use client";

import { useApiParamsFromStore } from "@/store/queryStore";
import { useQuerySWR } from "@/hooks/useQuerySWR";

import { UsersList } from "./UsersList";
import { DataPagination } from "@/components/common/DataPagination";
import { User } from "@/mock/users";

export function UsersPageClient() {
  const { filter, pagination, sorts } = useApiParamsFromStore();

  // Call the SWR hook once
  const { data, error, isLoading } = useQuerySWR<User>("/api/users", {
    filter,
    pagination,
    sorts,
  });

  return (
    <>
      <UsersList data={data} error={error} isLoading={isLoading} />
      {error || isLoading ? null : <DataPagination<User> data={data} />}
    </>
  );
}
