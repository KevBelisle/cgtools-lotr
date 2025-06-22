import { Card as GameCard } from "@/lotr/lotr-schema";
import { Box, Image, type HTMLChakraProps } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback } from "react";

export const CardImages = memo(
  ({ card, highlighted }: { card: GameCard; highlighted?: boolean }) => {
    let aspectRatio = 2.5 / 3.5; // Default for vertical cards
    let borderRadius = "4.2% / 3%"; // Default border radius
    let width = "65%";
    let height = "auto";
    let frontTransform = "rotate(-2deg) translate(-25%, 0)";
    let backTransform = "rotate(2deg) translate(25%, 0)";

    if (card.Front.Orientation == "Horizontal") {
      aspectRatio = 3.5 / 2.5; // Adjust for horizontal cards
      borderRadius = "3% / 4.2%"; // Adjust border radius for horizontal cards
      width = "auto"; // Use full width for horizontal cards
      height = "65%"; // Use full width for horizontal cards
      frontTransform = "rotate(2deg) translate(0%, 25%)"; // Adjust transform for horizontal cards
      backTransform = "rotate(-2deg) translate(0%, -25%)"; // Adjust transform for horizontal cards
    }

    const isEncounterCard =
      ([
        "Quest",
        "Enemy",
        "ShipEnemy",
        "Location",
        "Treachery",
        "EncounterSideQuest",
        "Objective",
        "ObjectiveHero",
        "ObjectiveAlly",
        "ObjectiveLocation",
        "ShipObjective",
      ].includes(card.Front.Type) ||
        card.Front.Keywords?.includes("Encounter.")) &&
      !card.Front.Text.includes("functions like a player card");

    const backImageUrl = card.ProductCards[0].BackImageUrl
      ? `https://images.cardgame.tools/lotr/sm/${card.ProductCards[0].BackImageUrl}`
      : isEncounterCard
        ? {
            Horizontal: "./images/HorizontalEncounterBack.jpg",
            Vertical: "./images/VerticalEncounterBack.jpg",
          }[card.Front.Orientation]
        : {
            Horizontal: "./images/HorizontalPlayerBack.jpg",
            Vertical: "./images/VerticalPlayerBack.jpg",
          }[card.Front.Orientation];

    const highlighBackImageOnHover = !!card.ProductCards[0].BackImageUrl;

    const navigate = useNavigate({ from: "/cards/search" });
    const handleClick = useCallback(() => {
      navigate({ to: "/cards/$card-slug", params: { "card-slug": card.Slug } });
    }, [card.Slug, navigate]);

    return (
      <>
        <Image
          src={`https://images.cardgame.tools/lotr/sm/${card.ProductCards[0]?.FrontImageUrl}`}
          alt={card.Front.Title}
          bg={"night.800"}
          width={width}
          height={height}
          aspectRatio={aspectRatio}
          borderRadius={borderRadius}
          borderWidth={3}
          borderStyle={"solid"}
          borderColor={"night.800"}
          zIndex={20}
          transform={frontTransform}
          onClick={handleClick}
          cursor="pointer"
          boxShadow={
            highlighted
              ? "0 0 0 3px var(--chakra-colors-yellow-600), 0 0 15px -3px var(--chakra-colors-yellow-600)"
              : "none"
          }
        />
        <Image
          src={backImageUrl}
          filter={
            card.Back?.Title
              ? ""
              : "brightness(0.85) contrast(0.85) saturate(0.85)"
          }
          alt={card.Back?.Title ?? "Back of card"}
          bg={"night.800"}
          width={width}
          height={height}
          aspectRatio={aspectRatio}
          position={"absolute"}
          borderRadius={borderRadius}
          borderWidth={3}
          borderStyle={"solid"}
          borderColor={"night.800"}
          zIndex={10}
          _hover={{ zIndex: highlighBackImageOnHover ? 30 : 10 }}
          transform={backTransform}
          boxShadow={
            highlighted
              ? "0 0 0 3px var(--chakra-colors-yellow-600), 0 0 15px -3px var(--chakra-colors-yellow-600)"
              : "none"
          }
        />
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.card.Slug === nextProps.card.Slug &&
    prevProps.highlighted === nextProps.highlighted,
);

export const ArtOnly = memo(
  ({
    card,
    highlighted,
    ...rootProps
  }: {
    card: GameCard;
    highlighted?: boolean;
  } & HTMLChakraProps<"div">) => {
    return (
      <Box
        width={"100%"}
        height={"100%"}
        position={"relative"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        aspectRatio={1}
        {...rootProps}
      >
        <CardImages card={card} highlighted={highlighted} />
      </Box>
    );
  },
  (prevProps, nextProps) =>
    prevProps.card.Slug === nextProps.card.Slug &&
    prevProps.highlighted === nextProps.highlighted,
);

export default ArtOnly;
