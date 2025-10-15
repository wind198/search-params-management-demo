/**
 * Server-side data fetching functions for SWR fallback
 * These functions run on the server and provide initial data to SWR
 */

import { NextRequest } from "next/server";
import { buildQueryStringFromParamsMap } from "@/helpers/buildQueryStringFromParamsMap";
import { IPaginatedData } from "@/types/paginatedData";
import { User } from "@/mock/users";
import { Product } from "@/mock/products";
import { ISearchParamsMapPerPath } from "@/store/queryStore";

// Server-side data fetching function for users
export async function getUsersData(
  fullSearchParams: ISearchParamsMapPerPath
): Promise<IPaginatedData<User>> {
  try {
    console.log("getUsersData running on server");

    // Import the API route handler directly
    const { GET } = await import("../app/api/users/route");

    const apiUrl = new URL(
      "http://localhost:3000/api/users?" +
        buildQueryStringFromParamsMap(fullSearchParams)
    );

    const request = new NextRequest(apiUrl.toString());
    const response = await GET(request);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Server-side data fetching function for products
export async function getProductsData(
  fullSearchParams: ISearchParamsMapPerPath
): Promise<IPaginatedData<Product>> {
  try {
    console.log("getProductsData running on server");

    // Import the API route handler directly
    const { GET } = await import("../app/api/products/route");

    const apiUrl = new URL(
      "http://localhost:3000/api/products?" +
        buildQueryStringFromParamsMap(fullSearchParams)
    );

    const request = new NextRequest(apiUrl.toString());
    const response = await GET(request);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Helper function to get the exact SWR key that will be used on the client
export function getUsersSWRKey(searchParams: ISearchParamsMapPerPath): string {
  // Extract only the API parameters (filter, pagination, sorts) from search params
  const apiParams = {
    filter: searchParams.filter,
    pagination: searchParams.pagination,
    sorts: searchParams.sorts,
  };
  const queryString = buildQueryStringFromParamsMap(apiParams);
  return `/api/users?${queryString}`;
}

export function getProductsSWRKey(
  searchParams: ISearchParamsMapPerPath
): string {
  // Extract only the API parameters (filter, pagination, sorts) from search params
  const apiParams = {
    filter: searchParams.filter,
    pagination: searchParams.pagination,
    sorts: searchParams.sorts,
  };
  const queryString = buildQueryStringFromParamsMap(apiParams);
  return `/api/products?${queryString}`;
}
