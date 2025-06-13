import { Tag } from "@/components/ui/tag";
import { Card as GameCard } from "@/lotr/lotr-schema";
import { Card, type HTMLChakraProps, List, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";

import { CardSideInfo } from "./card-side-info";
import sphereData from "./sphere-data";

export const FullCard = memo(
  ({
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
        fontSize="sm"
        fontFamily={"times, serif"}
        {...rootProps}
      >
        <CardSideInfo
          cardSide={cardSide}
          cardSlug={card.Slug}
          borderColor={borderColor}
          SphereIcon={SphereIcon}
          hasBack={hasBack}
          onFlipCard={flipCard}
          showFlavorText={true}
        />

        <Card.Footer
          borderTopColor={borderColor}
          borderTopWidth="1px"
          borderTopStyle="solid"
          pt={4}
        >
          <List.Root listStyleType={"none"} fontFamily={"sans-serif"}>
            {card.ProductCards?.sort((a, _) =>
              a.Product.IsRepackage ? 1 : -1,
            ).map((pc) => (
              <List.Item key={`${pc.Product.Code}-${pc.Number}`}>
                {pc.Product.IsRepackage ? (
                  <Tag
                    colorPalette={"teal"}
                    size="sm"
                    width="2rem"
                    top="2px"
                    position="relative"
                    variant="subtle"
                    justifyContent={"center"}
                  >
                    RC
                  </Tag>
                ) : (
                  <Tag
                    colorPalette={"red"}
                    size="sm"
                    width="2rem"
                    top="2px"
                    position="relative"
                    variant="subtle"
                    justifyContent={"center"}
                  >
                    OG
                  </Tag>
                )}{" "}
                <Text as="span" color="sand.500">
                  {pc.Quantity}x in{" "}
                </Text>
                <Link
                  to="/products/$product-code"
                  params={{ "product-code": pc.Product.Code }}
                >
                  {pc.Product.Name}
                </Link>{" "}
                {pc.Product.Cycle && !pc.Product.IsRepackage && (
                  <Text as="span" color="sand.500">
                    {pc.Product.Type == "Nightmare_Expansion"
                      ? " Nightmare Deck "
                      : null}
                    ({pc.Product.Cycle} cycle)
                  </Text>
                )}
              </List.Item>
            ))}
          </List.Root>
        </Card.Footer>
      </Card.Root>
    );
  },
);

export default FullCard;
