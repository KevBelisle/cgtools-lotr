import { cardBaseQuery, CardBaseQueryResult } from "@/lotr/database-schema";
import { FullCard } from "@/lotr/display/full-card";
import { Card, lotrCardFromCardBaseQuery } from "@/lotr/lotr-schema";
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
        src={`https://images.cardgame.tools/lotr/sm/${card.ProductCards[0]?.FrontImageUrl}`}
        alt={card.Front.Title}
      />
      <FullCard key={card.Slug} card={card} />
    </Container>
  );
}
