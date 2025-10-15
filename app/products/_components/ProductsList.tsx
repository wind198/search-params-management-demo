"use client";

import { useQueryStore } from "@/store/queryStore";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Product } from "@/mock/products";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { getDefaultSearchParamsMap } from "@/config/queryConfig";
import { IPaginatedData } from "@/types/paginatedData";
import { useUpdateUrlAfterUpdateQueryState } from "@/hooks/useUpdateUrlAfterUpdateQueryState";

interface ProductsListProps {
  data?: IPaginatedData<Product>;
  error?: Error;
  isLoading?: boolean;
}

export function ProductsList({ data, error, isLoading }: ProductsListProps) {
  const pathname = usePathname();

  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);

  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();

  const layout = useQueryStore(
    (s) =>
      (s.queryStates[pathname]?.layout ||
        getDefaultSearchParamsMap(pathname).layout) as string
  );
  console.log("layout", layout);

  const toggleLayout = () => {
    const newState = setParamsForPath(
      pathname,
      "layout",
      layout === "grid" ? "list" : "grid"
    );
    onQueryStateChange(newState);
  };

  if (isLoading) {
    return <LoadingState message="Loading products..." />;
  }
  if (error) {
    return (
      <ErrorState
        title="Error loading products"
        message="Please try again later"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!data) return null;

  if (data.data.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Try adjusting your filters"
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={toggleLayout}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <span>Layout: {layout}</span>
          <span>{layout === "grid" ? "⊞" : "☰"}</span>
        </button>
      </div>

      {layout === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {product.image && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={480}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              product.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2 capitalize">
          {product.category}
        </p>
        {product.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="text-2xl font-bold text-gray-900">${product.price}</p>
      </div>
    </div>
  );
}

function ProductListItem({ product }: { product: Product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {product.image && (
          <div className="flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={480}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm capitalize mb-1">
            {product.category}
          </p>
          {product.description && (
            <p className="text-gray-500 text-sm line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              product.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
          <p className="text-xl font-bold text-gray-900">${product.price}</p>
        </div>
      </div>
    </div>
  );
}
