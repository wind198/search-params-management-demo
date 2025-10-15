/**
 * Products page with SWR data fetching
 * Demonstrates how to use SWR with RSC fallback data
 */

import { ProductsPageClient } from "./_components/ProductsPageClient";
import { ProductsFilters } from "./_components/ProductsFilters";
import { ProductsSorting } from "./_components/ProductsSorting";

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Browse and manage product inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductsFilters />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ProductsSorting />
          </div>

          <ProductsPageClient />
        </div>
      </div>
    </div>
  );
}
