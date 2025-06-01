import { cardBaseQuery, CardBaseQueryResult } from "@/lotr/database-schema";
import { Card, lotrCardFromCardBaseQuery } from "@/lotr/lotr-schema";
import SmallCard from "@/lotr/small-card";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Container, Image } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cards/$card-slug")({
  component: RouteComponent,

  loader: async ({ params, context }) => {
    const compiledQuery = cardBaseQuery
      .where("c.Slug", "=", params["card-slug"])
      .limit(1)
      .compile();

    const queryResult = execCompiledQuery(
      compiledQuery,
      context.sqljsDbContext.sqljsDb!,
    )[0];
    return lotrCardFromCardBaseQuery(
      queryResult as CardBaseQueryResult,
    ) as Card;
  },
});

function RouteComponent() {
  const card = Route.useLoaderData();
  return (
    <Container py={8}>
      <Image
        src={`https://images.cardgame.tools/lotr/sm/${card.ProductCard?.FrontImageUrl}`}
        alt={card.Front.Title}
      />
      <SmallCard key={card.Slug} card={card} />
    </Container>
  );
}
