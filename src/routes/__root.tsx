import { Toaster } from "@/components/ui/toaster";
import { Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

declare global {
  interface Window {
    umami?: { track: (props?: object) => void };
  }
}

import { NotFound } from "@/components/pages/not-found";
import { SearchFilterContextType } from "@/components/ui/advanced-filters-provider";
import NavBar from "@/components/ui/nav-bar";
import { SortOrderContextType } from "@/components/ui/sort-order-provider";
import Footer from "@/lotr/footer";
import { RCOOnlyFilterContextType } from "@/lotr/rco-filter-provider";
import { SqljsDbContextType } from "@/sqljs/sqljs-provider";

interface RouterContext {
  sqljsDbContext: SqljsDbContextType;
  searchFilterContext: SearchFilterContextType;
  sortOrderContext: SortOrderContextType;
  rcoOnlyFilterContext: RCOOnlyFilterContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  const { pathname, searchStr } = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    window.umami?.track({ url: pathname + searchStr, title: document.title });
  }, [pathname, searchStr]);

  return (
    <>
      <NavBar />
      <Outlet />

      <Footer />

      <Toaster />
    </>
  );
}
