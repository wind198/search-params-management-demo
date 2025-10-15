"use client";

import { useApiParamsFromStore, useQueryStore } from "@/store/queryStore";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { DEFAULT_FILTER_PARAMS } from "@/config/queryConfig";
import { useUpdateUrlAfterUpdateQueryState } from "@/hooks/useUpdateUrlAfterUpdateQueryState";

export function ProductsFilters() {
  const pathname = usePathname();
  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);

  const { filter } = useApiParamsFromStore();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
  ];

  const hasActiveFilters = Object.keys(filter ?? {}).length > 0;

  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">filter</CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newState = setParamsForPath(
                pathname,
                "filter",
                DEFAULT_FILTER_PARAMS
              );
              onQueryStateChange(newState);
            }}
          >
            Clear all
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={(filter?.category as string) || "all"}
            onValueChange={(value) => {
              const newState = setParamsForPath(pathname, "filter", {
                ...filter,
                category: value,
              });
              onQueryStateChange(newState);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Status</label>
          <RadioGroup
            value={
              filter?.inStock === undefined
                ? "all"
                : filter?.inStock === true
                ? "inStock"
                : "outOfStock"
            }
            onValueChange={(value) => {
              let newState;
              if (value === "all") {
                newState = setParamsForPath(pathname, "filter", {
                  ...filter,
                  inStock: undefined,
                });
              } else if (value === "inStock") {
                newState = setParamsForPath(pathname, "filter", {
                  ...filter,
                  inStock: true,
                });
              } else {
                newState = setParamsForPath(pathname, "filter", {
                  ...filter,
                  inStock: false,
                });
              }
              onQueryStateChange(newState);
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all" className="text-sm">
                All
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inStock" id="inStock" />
              <label htmlFor="inStock" className="text-sm">
                In Stock
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outOfStock" id="outOfStock" />
              <label htmlFor="outOfStock" className="text-sm">
                Out of Stock
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Min</label>
              <Input
                type="number"
                placeholder="0"
                value={(filter?.priceMin as string) || ""}
                onChange={(e) => {
                  const newState = setParamsForPath(pathname, "filter", {
                    ...filter,
                    priceMin: e.target.value,
                  });
                  onQueryStateChange(newState);
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Max</label>
              <Input
                type="number"
                placeholder="1000"
                value={(filter?.priceMax as string) || ""}
                onChange={(e) => {
                  const newState = setParamsForPath(pathname, "filter", {
                    ...filter,
                    priceMax: e.target.value,
                  });
                  onQueryStateChange(newState);
                }}
              />
            </div>
          </div>
        </div>

        {/* Active filter Display */}
        {hasActiveFilters && (
          <div className="space-y-2 pt-4 border-t">
            <h4 className="text-sm font-medium">Active filter:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filter ?? {}).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="gap-1">
                  {key}: {String(value)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => {
                      const newState = setParamsForPath(pathname, "filter", {
                        ...(filter ?? {}),
                        [key]: undefined,
                      });
                      onQueryStateChange(newState);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
