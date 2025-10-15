import { buildQueryStringFromParamsMap } from "@/helpers/buildQueryStringFromParamsMap";
import { ISearchParamsMapPerPath } from "@/store/queryStore";
import { isEmpty } from "lodash-es";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUpdateUrlAfterUpdateQueryState() {
  const pathname = usePathname();

  const router = useRouter();

  /**
   * After manually update the query state
   * We need to update the url to reflect the actual state of the query store
   */
  const onQueryStateChange = useCallback(
    async (newParamsMap: ISearchParamsMapPerPath) => {
      console.log("syncURL onQueryStateChange");
      if (isEmpty(newParamsMap)) {
        router.push(pathname);
        return;
      }
      const searchParamToUpdateUrl =
        buildQueryStringFromParamsMap(newParamsMap);
      const url =
        pathname === "/"
          ? `?${searchParamToUpdateUrl}`
          : `${pathname.replace(/\/$/, "")}?${searchParamToUpdateUrl}`;

      router.push(url);
    },
    [pathname, router]
  );

  return { onQueryStateChange };
}
