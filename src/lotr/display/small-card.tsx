import { Card as GameCard } from "@/lotr/lotr-schema";
import { Card, type HTMLChakraProps } from "@chakra-ui/react";
import { useState } from "react";

import { CardSideInfo } from "./card-side-info";
import sphereData from "./sphere-data";

export const SmallCard = ({
  card,
  highlighted,
  ...rootProps
}: {
  card: GameCard;
  highlighted?: boolean;
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
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      fontFamily={"EB Garamond, times, serif"}
      boxShadow={
        highlighted
          ? "0 0 0 3px var(--chakra-colors-yellow-600), 0 0 15px -3px var(--chakra-colors-yellow-600)"
          : "none"
      }
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
