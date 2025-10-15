/**
 * Query Configuration Module
 *
 * This module centralizes all query-related configuration for the application.
 * It defines default values, allowed parameters, and provides utilities for
 * managing search parameters across different routes.
 *
 * Key responsibilities:
 * - Define default values for pagination, filters, and sorting
 * - Specify which parameters are allowed for each route
 * - Provide route-specific configuration through dedicated config modules
 * - Ensure consistency between client-side state and URL parameters
 */

import { IAllPaths } from "@/config/allPaths";
import { getDashboardConfig } from "@/config/dashboardConfig";
import { getProductsConfig } from "@/config/productConfig";
import { getUsersConfig } from "@/config/userConfig";
import { ISearchParamsMapPerPath } from "@/store/queryStore";
import {
  IApiParams,
  IFilterConfig,
  IPaginationConfig,
  ISortConfig,
} from "@/types/queryTypes";

/**
 * Configuration type for each route path
 * Defines what parameters are allowed and their default values
 */
export type IPathConfig = {
  allowedParams: readonly string[];
  defaultParamValues: ISearchParamsMapPerPath;
};

/**
 * Core API search parameter keys that are used across all routes
 * These correspond to the main data fetching parameters sent to API endpoints
 */
export const API_SEARCH_PARAMS_KEYS = [
  "filter",
  "pagination",
  "sorts",
] as const;

/**
 * Default pagination configuration
 * Used when no pagination parameters are specified in the URL
 */
export const DEFAULT_PAGINATION_PARAMS: IPaginationConfig = {
  page: 1,
  pageSize: 20,
} as const;

/**
 * Default filter configuration
 * Empty object means no filters are applied by default
 */
export const DEFAULT_FILTER_PARAMS: IFilterConfig = {};

/**
 * Type for dashboard allowed parameters
 * Extracted from API_SEARCH_PARAMS_KEYS for type safety
 */
export type IDashboardAllowedParams = (typeof API_SEARCH_PARAMS_KEYS)[number];

/**
 * Default sorting configuration
 * Empty array means no sorting is applied by default
 */
export const DEFAULT_SORTS_PARAMS: ISortConfig[] = [];

/**
 * Default API parameters object
 * Combines all default values into a single configuration object
 * Used by SWR hooks when no parameters are provided
 */
export const DEFAULT_API_PARAMS: IApiParams = {
  filter: DEFAULT_FILTER_PARAMS,
  pagination: DEFAULT_PAGINATION_PARAMS,
  sorts: DEFAULT_SORTS_PARAMS,
};

/**
 * Get default search parameters for a specific route
 *
 * This function returns the default parameter values for a given route path.
 * It's used to initialize the query store when a user first visits a route
 * and to determine which parameters should be removed from the URL when
 * they match the default values.
 *
 * @param path - The route path (e.g., "/products", "/users", "/")
 * @returns Default parameter values for the specified route
 */
export const getDefaultSearchParamsMap = (path: string) => {
  const _path = path as IAllPaths;
  switch (_path) {
    case "/products":
      return getProductsConfig().defaultParamValues;
    case "/users":
      return getUsersConfig().defaultParamValues;
    case "/":
      return getDashboardConfig().defaultParamValues;
    default:
      return {};
  }
};

/**
 * Get allowed parameters for a specific route
 *
 * This function returns the list of parameters that are allowed to be
 * stored in the query store for a given route. This helps prevent
 * invalid parameters from being persisted and ensures type safety.
 *
 * @param path - The route path (e.g., "/products", "/users", "/")
 * @returns Array of allowed parameter names for the specified route
 */
export const getAllowedParams = (path: string) => {
  const _path = path as IAllPaths;
  switch (_path) {
    case "/products":
      return getProductsConfig().allowedParams;
    case "/users":
      return getUsersConfig().allowedParams;
    case "/":
      return getDashboardConfig().allowedParams;
    default:
      return [];
  }
};
