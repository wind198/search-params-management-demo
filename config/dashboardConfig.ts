import {
  getProductsConfig,
  IProductAllowedParams,
} from "@/config/productConfig";
import { IPathConfig } from "@/config/queryConfig";

export type IDashboardAllowedParams = IProductAllowedParams;

export const getDashboardConfig = (): IPathConfig => getProductsConfig();
