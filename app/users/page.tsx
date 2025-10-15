/**
 * Users page with SWR data fetching
 * Demonstrates how to use SWR with RSC fallback data
 */

import { UsersPageClient } from "./_components/UsersPageClient";
import { UsersFilters } from "./_components/UsersFilters";
import { UsersSorting } from "./_components/UsersSorting";

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">Manage and view user information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <UsersFilters />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <UsersSorting />
          </div>

          <UsersPageClient />
        </div>
      </div>
    </div>
  );
}
