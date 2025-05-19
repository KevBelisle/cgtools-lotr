import { createFileRoute } from "@tanstack/react-router";

import { kysely } from "@/sqljs/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";

export const Route = createFileRoute("/cards/$cardSlug")({
  component: RouteComponent,

  loader: async ({ params, context }) => {
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
      .where("c.Slug", "=", params.cardSlug)
      .limit(1)
      .compile();

    return execCompiledQuery(compiledQuery, context.sqljsDbContext.sqljsDb)[0];
  },
});

function RouteComponent() {
  const card = Route.useLoaderData();
  return <div>{JSON.stringify(card, null, 2)}</div>;
}
