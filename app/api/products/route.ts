import { parseSearchParamsMapFromUrl } from "@/helpers/parseSearchParamsMapFromUrl";
import { IFilterConfig } from "@/types/queryTypes";
import { NextRequest, NextResponse } from "next/server";
import { Product, products } from "@/mock/products";
import { IPaginatedData } from "@/types/paginatedData";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/products hitted");
    const searchParamsMap = parseSearchParamsMapFromUrl(request.url);
    // Parse query parameters with defaults
    const filter = searchParamsMap.filter || ({} as IFilterConfig);
    const page = searchParamsMap.pagination.page as number;
    const pageSize = searchParamsMap.pagination.pageSize as number;
    const sorts = searchParamsMap.sorts || [];

    // Apply filters
    let filteredProducts = [...products];

    if (filter.category && filter.category !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filter.category
      );
    }

    if (filter.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.inStock === filter.inStock
      );
    }

    if (filter.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filter.priceMin
      );
    }

    if (filter.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filter.priceMax
      );
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    if (sorts.length > 0) {
      filteredProducts.sort((a, b) => {
        for (const sort of sorts) {
          const aVal = a[sort.key as keyof typeof a];
          const bVal = b[sort.key as keyof typeof b];

          if (aVal === undefined || bVal === undefined) return 0;
          if (typeof aVal === "string" && typeof bVal === "string") {
            return sort.order === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          } else if (typeof aVal === "number" && typeof bVal === "number") {
            return sort.order === "asc" ? aVal - bVal : bVal - aVal;
          } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
            return sort.order === "asc"
              ? Number(aVal) - Number(bVal)
              : Number(bVal) - Number(aVal);
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      data: paginatedProducts,
      pagination: {
        page,
        pageSize,
      },
      total,
    } satisfies IPaginatedData<Product>);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
