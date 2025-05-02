import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSqljsQuery } from "@/sqlite/SqljsProvider";
import { CardSearch } from "@/components/pages/debug";

type SearchFilters = {
  query: string;
};

export const Route = createFileRoute("/debug")({
  component: CardSearchRouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchFilters => {
    return {
      query: search.query as string,
    };
  },
});

function CardSearchRouteComponent() {
  const { query } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const setQuery = (query: string) => {
    navigate({
      search: (prev) => {
        return { ...prev, query: query };
      },
    });
  };

  const { error, results } = useSqljsQuery(query);

  return (
    <CardSearch
      query={query}
      setQuery={setQuery}
      error={error}
      results={results}
    />
  );
}
