"use client";

import { useSyncStoreAfterNavigateToUrl } from "@/hooks/useSyncStoreAfterNavigateToUrl";

interface RootLayoutClientWrapperProps {
  children: React.ReactNode;
}

export function RootLayoutClientWrapper({
  children,
}: RootLayoutClientWrapperProps) {
  // Initialize the URL update hook for query state management
  useSyncStoreAfterNavigateToUrl();

  return <>{children}</>;
}
