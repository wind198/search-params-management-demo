"use client";

import { useApiParamsFromStore, useQueryStore } from "@/store/queryStore";
import { usePathname } from "next/navigation";
// import { IFilterConfig, ISeachParamValue } from "@/types/queryTypes";
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

export function UsersFilters() {
  const pathname = usePathname();
  const setParamsForPath = useQueryStore((s) => s.setParamsForPath);

  const { filter = {} } = useApiParamsFromStore();

  const roles = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
    { value: "user", label: "User" },
  ];

  // const statuses = [
  //   { value: "all", label: "All Statuses" },
  //   { value: "active", label: "Active" },
  //   { value: "inactive", label: "Inactive" },
  //   { value: "pending", label: "Pending" },
  // ];

  const hasActiveFilters = Object.keys(filter).length > 0;
  const { onQueryStateChange } = useUpdateUrlAfterUpdateQueryState();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Filter</CardTitle>
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
        {/* Search Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={(filter.search as string) || ""}
            onChange={(e) => {
              const newState = setParamsForPath(pathname, "filter", {
                ...filter,
                search: e.target.value,
              });
              onQueryStateChange(newState);
            }}
          />
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={(filter.role as string) || "all"}
            onValueChange={(value) => {
              const newState = setParamsForPath(pathname, "filter", {
                ...filter,
                role: value === "all" ? undefined : value,
              });
              onQueryStateChange(newState);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <RadioGroup
            value={
              filter.status === undefined
                ? "all"
                : filter.status === "active"
                ? "active"
                : filter.status === "inactive"
                ? "inactive"
                : "pending"
            }
            onValueChange={(value) => {
              let newState;
              if (value === "all") {
                newState = setParamsForPath(pathname, "filter", {
                  ...filter,
                  status: undefined,
                });
              } else {
                newState = setParamsForPath(pathname, "filter", {
                  ...filter,
                  status: value,
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
              <RadioGroupItem value="active" id="active" />
              <label htmlFor="active" className="text-sm">
                Active
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactive" id="inactive" />
              <label htmlFor="inactive" className="text-sm">
                Inactive
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <label htmlFor="pending" className="text-sm">
                Pending
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Active filter Display */}
        {hasActiveFilters && (
          <div className="space-y-2 pt-4 border-t">
            <h4 className="text-sm font-medium">Active filter:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filter).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="gap-1">
                  {key}: {String(value)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => {
                      const newState = setParamsForPath(pathname, "filter", {
                        ...filter,
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
