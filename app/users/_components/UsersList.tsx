"use client";

import { useQueryStore } from "@/store/queryStore";
import { usePathname } from "next/navigation";
import { User } from "@/mock/users";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { getDefaultSearchParamsMap } from "@/config/queryConfig";
import Image from "next/image";
import { IPaginatedData } from "@/types/paginatedData";
import { useUpdateUrlAfterUpdateQueryState } from "@/hooks/useUpdateUrlAfterUpdateQueryState";

interface UsersListProps {
  data?: IPaginatedData<User>;
  error?: Error;
  isLoading?: boolean;
}

export function UsersList({ data, error, isLoading }: UsersListProps) {
  const pathname = usePathname();
  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);

  const layout = useQueryStore(
    (s) =>
      (s.queryStates[pathname]?.layout ||
        getDefaultSearchParamsMap(pathname).layout) as string
  );

  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();

  const toggleLayout = () => {
    const newState = setParamsForPath(
      pathname,
      "layout",
      layout === "table" ? "cards" : "table"
    );

    onQueryStateChange(newState);
  };

  if (isLoading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading users"
        message="Please try again later"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState title="No users found" message="Try adjusting your filters" />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={toggleLayout}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <span>View: {layout}</span>
          <span>{layout === "table" ? "☰" : "⊞"}</span>
        </button>
      </div>

      {layout === "table" ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserTableRow({ user }: { user: User }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {user.avatar ? (
            <Image
              width={40}
              height={40}
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            {user.lastLogin && (
              <div className="text-xs text-gray-500">
                Last login: {new Date(user.lastLogin).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.role === "admin"
              ? "bg-red-100 text-red-800"
              : user.role === "moderator"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-800"
              : user.status === "inactive"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button className="text-blue-600 hover:text-blue-900">Edit</button>
      </td>
    </tr>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {user.avatar ? (
          <Image
            width={40}
            height={40}
            src={user.avatar}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg font-medium text-gray-700">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        )}
        <div className="ml-4">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
          {user.lastLogin && (
            <p className="text-xs text-gray-500">
              Last login: {new Date(user.lastLogin).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Role:</span>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === "admin"
                ? "bg-red-100 text-red-800"
                : user.role === "moderator"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {user.role}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Status:</span>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.status === "active"
                ? "bg-green-100 text-green-800"
                : user.status === "inactive"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-800 py-2">
          Edit User
        </button>
      </div>
    </div>
  );
}
