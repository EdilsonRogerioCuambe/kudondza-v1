"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function useActiveRoute() {
  const pathname = usePathname();

  const activeRoute = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    // Se estamos na rota raiz do dashboard
    if (
      segments.length === 2 &&
      segments[0] === "admin" &&
      segments[1] === "dashboard"
    ) {
      return "/admin/dashboard";
    }

    // Se estamos em uma rota específica
    if (
      segments.length >= 3 &&
      segments[0] === "admin" &&
      segments[1] === "dashboard"
    ) {
      return pathname;
    }

    return pathname;
  }, [pathname]);

  const isActiveRoute = (url: string) => {
    // Para rotas exatas
    if (url === activeRoute) {
      return true;
    }

    // Para rotas que são subseções (ex: /admin/dashboard/courses deve ser ativo em /admin/dashboard/courses/create)
    if (activeRoute.startsWith(url) && url !== "/admin/dashboard") {
      return true;
    }

    // Para o dashboard principal
    if (url === "/admin/dashboard" && activeRoute === "/admin/dashboard") {
      return true;
    }

    return false;
  };

  const getRouteLevel = (url: string) => {
    const segments = url.split("/").filter(Boolean);
    return segments.length;
  };

  const isExactMatch = (url: string) => {
    return url === activeRoute;
  };

  return {
    activeRoute,
    isActiveRoute,
    getRouteLevel,
    isExactMatch,
    pathname,
  };
}
