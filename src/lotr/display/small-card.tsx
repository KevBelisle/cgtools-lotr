import { Card as GameCard } from "@/lotr/lotr-schema";
import { Card, type HTMLChakraProps } from "@chakra-ui/react";
import { useState } from "react";

import { CardSideInfo } from "./card-side-info";
import sphereData from "./sphere-data";

export const SmallCard = ({
  card,
  ...rootProps
}: {
  card: GameCard;
} & HTMLChakraProps<"div">) => {
  const [side, setSide] = useState("front" as "front" | "back");
  const flipCard = () => {
    setSide((prevSide) => (prevSide === "front" ? "back" : "front"));
  };
  const hasBack = !!card.Back?.Title;
  const cardSide = side === "front" ? card.Front : card.Back!;

  const { backgroundColor, borderColor, SphereIcon } = sphereData(
    cardSide.Sphere,
  );

  return (
    <Card.Root
      size={"sm"}
      borderWidth={2}
      boxShadow={"0 0.5rem 2.5rem -2rem var(--chakra-colors-night-950)"}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      fontFamily={"EB Garamond, times, serif"}
      {...rootProps}
    >
      <CardSideInfo
        cardSide={cardSide}
        cardSlug={card.Slug}
        borderColor={borderColor}
        SphereIcon={SphereIcon}
        hasBack={hasBack}
        onFlipCard={flipCard}
        showFlavorText={false}
      />
    </Card.Root>
  );
};

export default SmallCard;
