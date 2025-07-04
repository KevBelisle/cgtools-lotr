import { Tag } from "@/components/ui/tag";
import { Card as GameCard } from "@/lotr/lotr-schema";
import {
  Card,
  type HTMLChakraProps,
  List,
  Separator,
  Text,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";

import { expansionIcons } from "../expansion-icons";
import { CardSideInfo } from "./card-side-info";
import sphereData from "./sphere-data";

export const FullCard = memo(
  ({
    card,
    highlighted,
    showBothSides,
    ...rootProps
  }: {
    card: GameCard;
    highlighted?: boolean;
    showBothSides?: boolean;
  } & HTMLChakraProps<"div">) => {
    let [side, setSide] = useState("front" as "front" | "back");
    const flipCard = () => {
      setSide((prevSide) => (prevSide === "front" ? "back" : "front"));
    };

    let hasBack = !!card.Back?.Title;

    if (hasBack && showBothSides) {
      showBothSides = true;
    } else {
      showBothSides = false;
    }

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
        {showBothSides ? (
          <>
            <CardSideInfo
              cardSide={card.Front}
              cardSlug={card.Slug}
              borderColor={borderColor}
              SphereIcon={SphereIcon}
              hasBack={false}
              onFlipCard={flipCard}
              showFlavorText={true}
            />
            <Separator />
            <CardSideInfo
              cardSide={card.Back!}
              cardSlug={card.Slug}
              borderColor={borderColor}
              SphereIcon={SphereIcon}
              hasBack={false}
              onFlipCard={flipCard}
              showFlavorText={true}
            />
          </>
        ) : (
          <CardSideInfo
            cardSide={cardSide}
            cardSlug={card.Slug}
            borderColor={borderColor}
            SphereIcon={SphereIcon}
            hasBack={hasBack}
            onFlipCard={flipCard}
            showFlavorText={true}
          />
        )}

        <Card.Footer
          borderTopColor={borderColor}
          borderTopWidth="1px"
          borderTopStyle="solid"
          pt={4}
        >
          <List.Root listStyleType={"none"} fontFamily={"sans-serif"}>
            {card.ProductCards?.sort((a, _) =>
              a.Product.IsRepackage ? 1 : -1,
            ).map((pc) => {
              const ProductIcon = pc.Product.ExpansionSymbol
                ? expansionIcons[pc.Product.ExpansionSymbol]
                : null;

              return (
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
                    {pc.Quantity}x card{" "}
                  </Text>
                  <Text display="inline-block">
                    {ProductIcon ? (
                      <>
                        <ProductIcon
                          width="1.2em"
                          height="1.2em"
                          style={{
                            display: "inline-block",
                            verticalAlign: "text-bottom",
                          }}
                        />{" "}
                      </>
                    ) : (
                      "# "
                    )}
                    {pc.Number}
                  </Text>{" "}
                  <Text as="span" color="sand.500">
                    in
                  </Text>{" "}
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
              );
            })}
          </List.Root>
        </Card.Footer>
      </Card.Root>
    );
  },
);

export default FullCard;
