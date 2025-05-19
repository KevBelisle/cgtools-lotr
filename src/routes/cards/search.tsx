import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardSearch } from "@/components/pages/card-search";
import { kysely } from "@/sqljs/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { useState } from "react";

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

  loader: async ({ context, deps: { query } }) => {
    const compiledQuery = kysely
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
          eb("f.Search_Title", "like", `%${query}%`),
          eb("b.Search_Title", "like", `%${query}%`),
        ])
      )
      .groupBy(["c.Slug"])
      .limit(10)
      .compile();

    return execCompiledQuery(compiledQuery, context.sqljsDbContext.sqljsDb);
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
