import { Card as GameCard } from "@/lotr/lotr-schema";
import { Box, Card, HStack, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { Tooltip } from "@/components/ui/tooltip";

import Baggins from "@/lotr/icons/game icons/Baggins.svg?react";
import Fellowship from "@/lotr/icons/game icons/Fellowship.svg?react";
import Leadership from "@/lotr/icons/game icons/Leadership.svg?react";
import Lore from "@/lotr/icons/game icons/Lore.svg?react";
import Spirit from "@/lotr/icons/game icons/Spirit.svg?react";
import Tactics from "@/lotr/icons/game icons/Tactics.svg?react";

import Unique from "@/lotr/icons/game icons/Unique.svg?react";
import React from "react";
import { arePropsEqual } from "./util";

export const TinyCard = React.memo(({ card }: { card: GameCard }) => {
  var backgroundColor = "";
  var borderColor = "";
  var sphereIcon = null;

  switch (card.Front.Sphere) {
    case "Baggins":
      backgroundColor = "baggins.fg/10";
      borderColor = "baggins.fg";
      sphereIcon = <Baggins style={{ width: "35px", height: "35px" }} />;
      break;
    case "Fellowship":
      backgroundColor = "fellowship.fg/10";
      borderColor = "fellowship.fg";
      sphereIcon = <Fellowship style={{ width: "35px", height: "35px" }} />;
      break;
    case "Leadership":
      backgroundColor = "leadership.fg/10";
      borderColor = "leadership.fg";
      sphereIcon = <Leadership style={{ width: "35px", height: "35px" }} />;
      break;
    case "Lore":
      backgroundColor = "lore.fg/10";
      borderColor = "lore.fg";
      sphereIcon = <Lore style={{ width: "35px", height: "35px" }} />;
      break;
    case "Spirit":
      backgroundColor = "spirit.fg/10";
      borderColor = "spirit.fg";
      sphereIcon = <Spirit style={{ width: "35px", height: "35px" }} />;
      break;
    case "Tactics":
      backgroundColor = "tactics.fg/10";
      borderColor = "tactics.fg";
      sphereIcon = <Tactics style={{ width: "35px", height: "35px" }} />;
      break;
    case "Neutral":
      backgroundColor = "neutral.fg/10";
      borderColor = "sand.700";
      sphereIcon = (
        <div
          style={{
            fontSize: "35px",
            fontWeight: "bold",
            width: "35px",
            height: "35px",
          }}
        >
          <span
            style={{
              transform: "translate(6px, 10px)",
              display: "inline-block",
            }}
          >
            N
          </span>
        </div>
      );
      break;
    default:
      backgroundColor = "night.800/10";
      borderColor = "night.800";
      break;
  }

  return (
    <Card.Root
      size={"sm"}
      borderWidth={2}
      boxShadow={"0 0.5rem 2.5rem -2rem var(--chakra-colors-night-950)"}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      fontSize="sm"
      fontFamily={"times, serif"}
    >
      <VStack p={4} pb={2} gap={2} alignItems="stretch">
        <Card.Title
          fontFamily={"vafthrudnir"}
          fontVariant={"small-caps"}
          fontWeight={"normal"}
          fontSize="2xl"
        >
          <HStack justifyContent="space-between">
            <Link to="/cards/$card-slug" params={{ "card-slug": card.Slug }}>
              <span>
                {card.Front.IsUnique ? (
                  <Unique
                    style={{
                      display: "inline",
                      height: "1.4rem",
                      width: "1.4rem",
                    }}
                  />
                ) : (
                  ""
                )}{" "}
                {card.Front.Stage ? (
                  <Text as="span" fontSize="xl" color="sand.500">
                    {card.Front.Stage}
                  </Text>
                ) : (
                  ""
                )}{" "}
                {card.Front.Title}
              </span>
            </Link>
            {card.Front.Sphere && (
              <Tooltip content={card.Front.Sphere}>
                <Box color={borderColor} mt={"-2"}>
                  {sphereIcon}
                </Box>
              </Tooltip>
            )}
          </HStack>
        </Card.Title>
      </VStack>
    </Card.Root>
  );
}, arePropsEqual);
