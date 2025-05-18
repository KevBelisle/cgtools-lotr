import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import useKyselyQuery from "@/sqljs/use-kysely-query";
import { CardSearch } from "@/components/pages/card-search";

import { Database } from "@/database";
import {
  Kysely,
  DummyDriver,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from "kysely";

const db = new Kysely<Database>({
  dialect: {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  },
});

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

  const debouncedQuery = useDebounce(query, 300);

  const compiledQuery = useMemo(
    () =>
      db
        .selectFrom("cards as c")
        .leftJoin("cardSides as f", "f.Slug", "c.FrontSlug")
        .leftJoin("cardSides as b", "b.Slug", "c.BackSlug")
        .leftJoin("productCards as pc", "pc.CardSlug", "c.Slug")
        .select([
          "c.Slug",
          "f.Title",
          "f.Text",
          "f.FlavorText",
          "pc.FrontImageUrl",
        ])
        .where((eb) =>
          eb.or([
            eb("f.Search_Title", "like", `%${debouncedQuery}%`),
            eb("b.Search_Title", "like", `%${debouncedQuery}%`),
          ])
        )
        .groupBy(["c.Slug"])
        .limit(10)
        .compile(),
    [debouncedQuery]
  );

  const setQuery = (query: string) => {
    navigate({
      search: (prev) => {
        return { ...prev, query: query };
      },
      replace: true,
    });
  };

  const { error, results } = useKyselyQuery(compiledQuery);

  return (
    <CardSearch
      query={query}
      setQuery={setQuery}
      error={error}
      results={results}
    />
  );
}
