import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/glossary/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Outlet />
  );
}
