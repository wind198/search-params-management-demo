# Next.js Query State Management with SWR & RSC

A robust solution for managing complex query state in Next.js applications using **SWR** for intelligent data fetching, **React Server Components (RSC)** for optimal performance, and **Zustand** for unified state management. This architecture eliminates URL fragility by centralizing both UI state and data state in a single source of truth.

## 🚀 Key Benefits

### **SWR + RSC Architecture**

- **Improved FCP (First Contentful Paint)**: Server-side rendering with RSC delivers faster initial page loads
- **Intelligent Data Fetching**: SWR handles caching, revalidation, and background updates seamlessly
- **Unified State Management**: Single Zustand store manages both UI state (tabs, layout) and data state (API params)
- **URL Resilience**: Eliminates fragile URL-based state management

### **Performance Optimizations**

- **Server-Side Rendering**: Initial data fetched on server, minimizing client-side loading time
- **Smart Caching**: SWR provides automatic caching with stale-while-revalidate strategy
- **Optimized Re-renders**: Zustand store updates trigger only necessary component re-renders
- **Background Updates**: SWR automatically refetches data when needed without blocking the UI

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   RSC Server    │    │   SWR Client     │    │  Zustand Store  │
│                 │    │                  │    │                 │
│ • Initial Data  │───▶│ • Caching        │───▶│ • UI State      │
│ • Fast FCP      │    │ • Revalidation   │    │ • Data State    │
│ • SEO Optimized │    │ • Background Sync│    │ • URL Sync      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🧩 Core Components

### 1. **Unified Query Store** (`store/queryStore.ts`)

Centralized state management that orchestrates both UI and data state:

```typescript
export type QueryStoreState = {
  queryStates: Record<string, ISearchParamsMapPerPath>;
  mergedWithStorage: boolean;
};

export type QueryStoreActions = {
  updateQueryState: (
    path: string,
    updates: Partial<ISearchParamsMapPerPath>
  ) => ISearchParamsMapPerPath;
  setParamsForPath: (
    path: string,
    key: string,
    value: unknown
  ) => ISearchParamsMapPerPath;
};
```

**Key Features:**

- **Single Source of Truth**: Manages both UI state (tabs, layout) and data state (filters, pagination)
- **Automatic Sanitization**: Validates and cleans parameters before storage
- **Persistent Memory**: Maintains state across navigation and page refreshes
- **Type Safety**: Full TypeScript support with strict typing

### 2. **SWR Data Fetching** (`hooks/useQuerySWR.ts`)

Generic SWR hook for intelligent data fetching:

```typescript
export function useQuerySWR<T>(
  endpoint: string,
  apiParams: IApiParams,
  options?: SWROptions
) {
  const queryString = buildQueryStringFromParamsMap(apiParams);
  const key = `${endpoint}?${queryString}`;

  return useSWR<IPaginatedData<T>>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });
}
```

**Benefits:**

- **Intelligent Caching**: SWR handles smart caching and request deduplication
- **Background Updates**: Data remains fresh without blocking the UI
- **Error Handling**: Built-in error states and retry logic
- **Performance**: Automatically deduplicates identical requests

### 3. **URL Synchronization** (`hooks/useSyncStoreAfterNavigateToUrl.ts`)

Bidirectional synchronization between URL and store:

```typescript
export function useSyncStoreAfterNavigateToUrl() {
  const synchroizeQueryStoreOnUrlChange = async (
    pathname: string,
    searchParams: ReadonlyURLSearchParams
  ) => {
    const searchParams = parseSearchParamsMapFromUrl(searchString);
    const newState = updateQueryState(pathname, searchParams);
    const searchParamToUpdateUrl = buildQueryStringFromParamsMap(newState);
    router.replace(`${pathname}?${searchParamToUpdateUrl}`);
  };
}
```

### 4. **State Updates** (`hooks/useUpdateUrlAfterUpdateQueryState.ts`)

Manages state changes and URL updates:

```typescript
export function useUpdateUrlAfterUpdateQueryState() {
  const onQueryStateChange = useCallback(
    async (newParamsMap: ISearchParamsMapPerPath) => {
      if (isEmpty(newParamsMap)) {
        router.push(pathname);
        return;
      }
      const searchParamToUpdateUrl =
        buildQueryStringFromParamsMap(newParamsMap);
      router.push(`${pathname}?${searchParamToUpdateUrl}`);
    },
    [pathname, router]
  );
}
```

## 🎯 RSC + SWR Benefits

### **Server-Side Rendering (RSC)**

```typescript
// app/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Server-side data fetching for optimal FCP
  const initialData = await getProducts(searchParams);

  return (
    <SWRConfig value={{ fallbackData: { products: initialData } }}>
      <ProductsPageClient />
    </SWRConfig>
  );
}
```

### **Client-Side Hydration**

```typescript
// app/products/_components/ProductsPageClient.tsx
export function ProductsPageClient() {
  const { filter, pagination, sorts } = useApiParamsFromStore();

  // SWR seamlessly uses fallback data from RSC
  const { data, error, isLoading } = useProductsQuerySWR({
    filter,
    pagination,
    sorts,
  });

  return <ProductsList products={data?.products} />;
}
```

## 🔧 Usage Examples

### **Complete State Management**

```typescript
function ProductsFilters() {
  const { filter } = useApiParamsFromStore();
  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);
  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();

  const handleCategoryChange = (category: string) => {
    const newState = setParamsForPath(pathname, "filter", {
      ...filter,
      category,
    });
    onQueryStateChange(newState);
  };

  return (
    <Select value={filter.category} onValueChange={handleCategoryChange}>
      <SelectContent>
        <SelectItem value="electronics">Electronics</SelectItem>
        <SelectItem value="clothing">Clothing</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### **SWR Data Fetching**

```typescript
function ProductsList() {
  const { filter, pagination, sorts } = useApiParamsFromStore();

  // SWR manages caching, revalidation, and background updates
  const { data, error, isLoading, mutate } = useProductsQuerySWR({
    filter,
    pagination,
    sorts,
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div>
      {data?.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🚀 Performance Optimizations

### **1. RSC for Optimal FCP**

- **Server-Side Data Fetching**: Initial data loaded on server
- **Reduced Client Bundle**: Minimal JavaScript sent to client
- **SEO Optimized**: Search engines see full content immediately

### **2. SWR for Intelligent Caching**

- **Automatic Deduplication**: Identical requests are deduplicated
- **Background Revalidation**: Data remains fresh without blocking UI
- **Stale-While-Revalidate**: Displays cached data while fetching fresh data

### **3. Zustand for Optimized Re-renders**

- **Selective Subscriptions**: Components re-render only when their data changes
- **Immer Integration**: Efficient immutable updates
- **Persistent Memory**: State survives page refreshes and navigation

## 📊 State Management Flow

```
1. User Interaction (Filter Change)
   ↓
2. Zustand Store Update (setParamsForPath)
   ↓
3. URL Synchronization (useUpdateUrlAfterUpdateQueryState)
   ↓
4. SWR Cache Invalidation (useQuerySWR)
   ↓
5. Background Data Fetch (SWR)
   ↓
6. UI Update (React Re-render)
```

## 🎨 UI State vs Data State

### **UI State** (Managed by Zustand)

- Layout preferences (grid/list view)
- Tab selections
- Panel visibility states
- User interface preferences

### **Data State** (Managed by Zustand + SWR)

- API parameters (filters, pagination, sorting)
- Search queries
- Data fetching states
- Cache management

## 🔧 Configuration

### **Route Configuration**

```typescript
// config/queryConfig.ts
export const queryConfig = {
  "/products": {
    filter: { category: "all" },
    pagination: { page: 1, pageSize: 20 },
    sorts: [{ key: "name", order: "asc" }],
  },
  "/users": {
    filter: { role: "all" },
    pagination: { page: 1, pageSize: 10 },
    sorts: [{ key: "createdAt", order: "desc" }],
  },
};
```

### **SWR Configuration**

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
```

## 🚀 Getting Started

1. **Install Dependencies**

```bash
pnpm add zustand swr immer
```

2. **Copy Implementation**

- Copy the store, hooks, and utility files
- Configure your routes in `config/queryConfig.ts`

3. **Use in Components**

```typescript
// Server Component (RSC)
export default async function Page({ searchParams }) {
  const initialData = await fetchData(searchParams);

  return (
    <SWRConfig value={{ fallbackData: initialData }}>
      <ClientComponent />
    </SWRConfig>
  );
}

// Client Component
function ClientComponent() {
  const { data } = useQuerySWR("/api/data", apiParams);
  return <div>{/* Your UI */}</div>;
}
```

## 🎯 Key Advantages

### **vs URL-Based State Management**

- ✅ **Eliminates URL Fragility**: State managed in memory, not URL
- ✅ **Complex State Support**: Nested objects, arrays, functions
- ✅ **Performance**: No URL parsing on every render
- ✅ **Persistence**: State survives navigation and refreshes

### **vs Traditional State Management**

- ✅ **RSC Integration**: Server-side rendering for optimal FCP
- ✅ **Intelligent Caching**: SWR handles data fetching optimization
- ✅ **Type Safety**: Full TypeScript support throughout
- ✅ **Modular**: Easy to extend and maintain

## 📝 License

Built with ❤️ for the Next.js community. Feel free to adapt and modify according to your needs.

---

**This architecture delivers a robust, performant solution for complex query state management in modern Next.js applications.**
