import { Toaster } from "@/components/ui/toaster";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { NotFound } from "@/components/pages/not-found";
import { SearchFilterContextType } from "@/components/ui/advanced-filters-provider";
import NavBar from "@/components/ui/nav-bar";
import { SortOrderContextType } from "@/components/ui/sort-order-provider";
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
  return (
    <>
      <NavBar />
      <Outlet />

      <Toaster />
    </>
  );
}
