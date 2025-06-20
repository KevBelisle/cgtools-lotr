import { SearchFilterProvider } from "@/components/ui/advanced-filters-provider";
import { DisplayOptionProvider } from "@/components/ui/display-provider";
import { SortOrderProvider } from "@/components/ui/sort-order-provider";
import { RCOOnlyFilterProvider } from "@/lotr/rco-filter-provider";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import { displayOptions } from "@/lotr/display-options";

export const Route = createFileRoute("/cards/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RCOOnlyFilterProvider>
      <SearchFilterProvider>
        <SortOrderProvider>
          <DisplayOptionProvider
            displayOptions={displayOptions}
            persistedStateKey="cards-display-option"
          >
            <Outlet />
          </DisplayOptionProvider>
        </SortOrderProvider>
      </SearchFilterProvider>
    </RCOOnlyFilterProvider>
  );
}
