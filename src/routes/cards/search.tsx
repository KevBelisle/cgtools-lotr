import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardSearch } from "@/components/pages/card-search";
import { cardBaseQuery, CardBaseQueryResult } from "@/sqljs/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { useState } from "react";
import { lotrCardFromCardBaseQuery } from "@/lotr-schema";
import { sql } from "kysely";

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
  loaderDeps: ({ search: { query } }) => ({ query }),

  loader: async ({ context, deps: { query: searchQuery } }) => {
    const compiledQuery = searchQuery
      ? cardBaseQuery
          .where((eb) =>
            eb.or([
              eb("f.Search_Title", "like", `%${searchQuery}%`),
              eb("b.Search_Title", "like", `%${searchQuery}%`),
            ])
          )
          .groupBy(["c.Slug"])
          .limit(30)
          .compile()
      : cardBaseQuery
          .where("f.Sphere", "is not", null)
          .groupBy(["c.Slug"])
          .orderBy(sql`random()`)
          .limit(30)
          .compile();
    const queryResults = execCompiledQuery(
      compiledQuery,
      context.sqljsDbContext.sqljsDb
    );
    return (queryResults as CardBaseQueryResult[]).map(
      lotrCardFromCardBaseQuery
    );
  },
});

function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

function CardSearchRouteComponent() {
  const { query: urlQuery } = Route.useSearch();
  const [query, setQuery] = useState(urlQuery);
  const cards = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const debouncedNavigate = debounce(navigate, 300);

  const rawSetQuery = (query: string) => {
    setQuery(query);
    debouncedNavigate({
      search: (prev: any) => {
        return { ...prev, query: query };
      },
      replace: true,
    });
  };

  return <CardSearch query={query} setQuery={rawSetQuery} cards={cards} />;
}
