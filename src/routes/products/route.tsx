import { DisplayOptionProvider } from "@/components/ui/display-provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { displayOptions, DisplayOptionType } from "@/lotr/display-options";
import { LuAlignJustify } from "react-icons/lu";

export const Route = createFileRoute("/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const displayOptionsWithList = [
    {
      name: "Card list",
      component: (<></>) as any,
      icon: LuAlignJustify,
      minWidth: "",
    } as DisplayOptionType,
    ...displayOptions,
  ];

  return (
    <DisplayOptionProvider
      displayOptions={displayOptionsWithList}
      persistedStateKey="products-display-option"
    >
      <Outlet />
    </DisplayOptionProvider>
  );
}
