import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Navigate
      to="/cards/search"
      search={{ query: "", page: 1 }}
      replace={true}
    />
  );
}
