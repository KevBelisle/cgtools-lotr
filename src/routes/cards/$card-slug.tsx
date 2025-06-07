import { cardBaseQuery, CardBaseQueryResult } from "@/lotr/database-schema";
import FullCard from "@/lotr/display/full-card";
import { Card, lotrCardFromCardBaseQuery } from "@/lotr/lotr-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Container, HStack, Image } from "@chakra-ui/react";
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

  const isEncounterCard =
    ([
      "QUEST",
      "ENEMY",
      "SHIP_ENEMY",
      "LOCATION",
      "TREACHERY",
      "ENCOUNTER_SIDE_QUEST",
      "CAVE",
      "OBJECTIVE",
      "OBJECTIVE_HERO",
      "OBJECTIVE_ALLY",
      "OBJECTIVE_LOCATION",
      "SHIP_OBJECTIVE",
    ].includes(card.Front.Type) ||
      card.Front.Keywords?.includes("Encounter.")) &&
    !card.Front.Text.includes("functions like a player card");

  const backImageUrl = card.ProductCards[0].BackImageUrl
    ? `https://images.cardgame.tools/lotr/sm/${card.ProductCards[0].BackImageUrl}`
    : isEncounterCard
      ? {
          Horizontal: "/images/HorizontalEncounterBack.jpg",
          Vertical: "/images/VerticalEncounterBack.jpg",
        }[card.Front.Orientation]
      : {
          Horizontal: "/images/HorizontalPlayerBack.jpg",
          Vertical: "/images/VerticalPlayerBack.jpg",
        }[card.Front.Orientation];

  let aspectRatio = 2.5 / 3.5; // Default for vertical cards
  let borderRadius = "4.2% / 3%"; // Default border radius
  let width = "40vw";
  let maxWidth = "400px";
  let height = "auto";
  let maxHeight = "unset";
  let frontTransform = "rotate(-2deg)";
  let backTransform = "rotate(2deg)";

  if (card.Front.Orientation == "Horizontal") {
    aspectRatio = 3.5 / 2.5; // Adjust for horizontal cards
    borderRadius = "3% / 4.2%"; // Adjust border radius for horizontal cards
    width = "auto"; // Use full width for horizontal cards
    maxWidth = "100%";
    height = "unset"; // Use full width for horizontal cards
    maxHeight = "400px";
    frontTransform = "rotate(2deg)"; // Adjust transform for horizontal cards
    backTransform = "rotate(-2deg)"; // Adjust transform for horizontal cards
  }

  return (
    <Container py={8}>
      <HStack justifyContent={"space-around"} mb={8} flexWrap="wrap">
        <Image
          src={`https://images.cardgame.tools/lotr/sm/${card.ProductCards[0]?.FrontImageUrl}`}
          alt={card.Front.Title}
          bg={"night.800"}
          width={width}
          maxWidth={maxWidth}
          height={height}
          maxHeight={maxHeight}
          aspectRatio={aspectRatio}
          borderRadius={borderRadius}
          borderWidth={3}
          borderStyle={"solid"}
          borderColor={"night.800"}
          transform={frontTransform}
        />
        <Image
          src={backImageUrl}
          alt={card.Back?.Title ?? "Back of card"}
          bg={"night.800"}
          width={width}
          maxWidth={maxWidth}
          height={height}
          maxHeight={maxHeight}
          aspectRatio={aspectRatio}
          borderRadius={borderRadius}
          borderWidth={3}
          borderStyle={"solid"}
          borderColor={"night.800"}
          transform={backTransform}
        />
      </HStack>
      <FullCard key={card.Slug} card={card} />
    </Container>
  );
}
