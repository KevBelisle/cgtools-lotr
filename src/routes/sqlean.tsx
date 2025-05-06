import { createFileRoute } from "@tanstack/react-router";

import { useSqleanQuery } from "@/sqlean/SqleanProvider";

export const Route = createFileRoute("/sqlean")({
  component: RouteComponent,
});

function RouteComponent() {
  const { error, results } = useSqleanQuery(
    "SELECT Title FROM cardSides WHERE text_translate(Title, 'É', 'E') LIKE '%Eowy%' LIMIT 10"
  );

  return <pre>{JSON.stringify({ error, results }, null, 2)}</pre>;
}
