import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSqljsQuery } from "@/sqljs/SqljsProvider";
import { CardSearch } from "@/components/pages/cardSearch";

type SearchFilters = {
  query: string;
};

export const Route = createFileRoute("/cards/search")({
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

  const sqlQuery = useMemo(
    () =>
      query == ""
        ? ""
        : `SELECT pc.FrontImageUrl AS FrontImageUrl, f.Title AS FrontTitle, f.Text AS FrontText, f.FlavorText AS FrontFlavorText, f.Sphere AS FrontSphere, f.Type AS FrontType
        FROM cards c
        LEFT JOIN cardSides f ON c.FrontSlug = f.Slug
        LEFT JOIN cardSides b ON c.Backslug = b.Slug
        LEFT JOIN productCards pc ON pc.CardSlug = c.Slug
        WHERE
          f.Search_Title LIKE '%${query}%' OR
          b.Search_Title LIKE '%${query}%'
        GROUP BY pc.FrontImageUrl, f.Title, f.Text, f.FlavorText, f.Sphere, f.Type
        LIMIT 50`,
    [query]
  );

  const setQuery = (query: string) => {
    navigate({
      search: (prev) => {
        return { ...prev, query: query };
      },
    });
  };

  const { error, results } = useSqljsQuery(sqlQuery);

  return (
    <CardSearch
      query={query}
      setQuery={setQuery}
      error={error}
      results={results}
    />
  );
}
