import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware that adds custom headers to the request
 * @param request
 * @returns NextResponse
 */
export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add custom headers to the request
  requestHeaders.set("x-custom-header", "added-by-middleware");
  const url = request.url;
  if (!url) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  requestHeaders.set("x-url", url);

  // Return the request with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match page render requests only, excluding:
     * - /api/* (API routes)
     * - /_next/static/* (static files)
     * - /_next/image/* (image optimization)
     * - /favicon.ico (favicon)
     * - /_next/webpack-hmr (hot reload)
     * - /_next/on-demand-entries (dev server)
     * - /public/* (public assets)
     */
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|_next/on-demand-entries|favicon.ico|public).*)",
  ],
};
