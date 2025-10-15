import { parseSearchParamsMapFromUrl } from "@/helpers/parseSearchParamsMapFromUrl";
import { IFilterConfig } from "@/types/queryTypes";
import { NextRequest, NextResponse } from "next/server";
import { User, users } from "@/mock/users";
import { IPaginatedData } from "@/types/paginatedData";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/users hitted");
    const searchParamsMap = parseSearchParamsMapFromUrl(request.url);
    // Parse query parameters with defaults
    const filter = searchParamsMap.filter || ({} as IFilterConfig);
    const page = searchParamsMap.pagination.page as number;
    const pageSize = searchParamsMap.pagination.pageSize as number;
    const sorts = searchParamsMap.sorts || [];

    // Apply filters
    let filteredUsers = [...users];

    if (filter.role && filter.role !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.role === filter.role);
    }

    if (filter.status && filter.status !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.status === filter.status);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm) ||
          u.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sorts.length > 0) {
      filteredUsers.sort((a, b) => {
        for (const sort of sorts) {
          const aVal = a[sort.key as keyof typeof a];
          const bVal = b[sort.key as keyof typeof b];

          if (aVal === null || bVal === null) return 0;
          if (aVal < bVal) return sort.order === "asc" ? -1 : 1;
          if (aVal > bVal) return sort.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply pagination
    const total = filteredUsers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      data: paginatedUsers,
      pagination: {
        page,
        pageSize,
      },
      total,
    } satisfies IPaginatedData<User>);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
