import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/toaster";

import NavBar from "@/components/ui/nav-bar";
import { NotFound } from "@/components/pages/not-found";

interface RouterContext {
  sqljsDbContext: any;
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
      <TanStackRouterDevtools />
    </>
  );
}
