"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    goatcounter?: { count?: (vars: { path: string }) => void };
  }
}

export function PageViews() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.goatcounter?.count?.({
      path: location.pathname + location.search,
    });
  }, [pathname]);

  return null;
}
