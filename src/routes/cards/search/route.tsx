import { Outlet, createFileRoute } from "@tanstack/react-router";

import { DisplayOptionProvider } from "@/components/ui/display-provider";
import { displayOptions } from "@/lotr/display-options";

export const Route = createFileRoute("/cards/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DisplayOptionProvider
      displayOptions={displayOptions}
      persistedStateKey="cards-display-option"
    >
      <Outlet />
    </DisplayOptionProvider>
  );
}
