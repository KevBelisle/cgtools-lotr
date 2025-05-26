import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";

import NavBar from "@/components/ui/nav-bar";
import { NotFound } from "@/components/pages/not-found";
import { SqljsDbContextType } from "@/sqljs/sqljs-provider";
import { SearchFilterContextType } from "@/components/ui/advanced-filters-provider";

interface RouterContext {
  sqljsDbContext: SqljsDbContextType;
  searchFilterContext: SearchFilterContextType;
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
