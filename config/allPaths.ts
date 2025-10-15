export const allPaths = ["/", "/products", "/users"] as const;

export type IAllPaths = (typeof allPaths)[number];
