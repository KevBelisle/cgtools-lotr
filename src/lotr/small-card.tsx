import { Card as GameCard } from "@/lotr-schema";
import { Em, Text, Card, HStack, VStack } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { Link } from "@tanstack/react-router";

import Attack from "./icons/game icons/Attack.svg?react";
import Defense from "./icons/game icons/Defense.svg?react";
import Willpower from "./icons/game icons/Willpower.svg?react";
import HitPoints from "./icons/game icons/HitPoints.svg?react";
import Threat from "./icons/game icons/Threat.svg?react";

import Lore from "./icons/game icons/Lore.svg?react";
import Spirit from "./icons/game icons/Spirit.svg?react";
import Tactics from "./icons/game icons/Tactics.svg?react";
import Leadership from "./icons/game icons/Leadership.svg?react";
import Fellowship from "./icons/game icons/Fellowship.svg?react";
import Baggins from "./icons/game icons/Baggins.svg?react";

import Unique from "./icons/game icons/Unique.svg?react";

export const SmallCard = ({ card }: { card: GameCard }) => {
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
      borderColor = "neutral.fg";
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
    >
      <Link to="/cards/$cardSlug" params={{ cardSlug: card.Slug }}>
        <VStack p={4} gap={2} alignItems="stretch">
          <Card.Title fontFamily={"vafthrudnir"}>
            <HStack justifyContent="space-between">
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
                {card.Front.Title}
              </span>
              {card.Front.Sphere && (
                <Text color={borderColor} mt={"-1"}>
                  {sphereIcon}
                </Text>
              )}
            </HStack>
          </Card.Title>

          <HStack justifyContent="space-between" flexWrap={"wrap"}>
            <HStack justifyContent="flex-end">
              <Tag>
                {card.Front.Type}
                {card.Front.Subtype && ` - ${card.Front.Subtype}`}
              </Tag>
              {card.Front.ResourceCost != null && (
                <Tag>
                  <HStack>
                    <Text>Cost:</Text>
                    <Text
                      fontFamily={"vafthrudnir"}
                      style={{ transform: "translate(0, 3px)" }}
                    >
                      {card.Front.ResourceCost}
                    </Text>
                  </HStack>
                </Tag>
              )}
              {card.Front.ThreatCost != null && (
                <Tag size="lg">
                  <Threat
                    style={{
                      display: "inline",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />{" "}
                  {card.Front.ThreatCost}
                </Tag>
              )}
            </HStack>
            <HStack flexGrow={1} justifyContent="flex-end">
              {card.Front.ThreatStrength != null && (
                <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                  <HStack gap="1">
                    <span style={{ transform: "translate(0, 3px)" }}>
                      {card.Front.ThreatStrength}
                    </span>
                    <Threat
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </HStack>
                </Tag>
              )}
              {card.Front.Attack != null && (
                <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                  <HStack gap="1">
                    <span style={{ transform: "translate(0, 3px)" }}>
                      {card.Front.Attack}
                    </span>
                    <Attack
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </HStack>
                </Tag>
              )}
              {card.Front.Defense != null && (
                <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                  <HStack gap="1">
                    <span style={{ transform: "translate(0, 3px)" }}>
                      {card.Front.Defense}
                    </span>
                    <Defense
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </HStack>
                </Tag>
              )}
              {card.Front.Willpower != null && (
                <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                  <HStack gap="1">
                    <span style={{ transform: "translate(0, 3px)" }}>
                      {card.Front.Willpower}
                    </span>
                    <Willpower
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </HStack>
                </Tag>
              )}
              {card.Front.HitPoints != null && (
                <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                  <HStack gap="1">
                    <span style={{ transform: "translate(0, 3px)" }}>
                      {card.Front.HitPoints}
                    </span>
                    <HitPoints
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  </HStack>
                </Tag>
              )}
            </HStack>
          </HStack>
          <Em fontSize="sm" fontFamily={"serif"}>
            {card.Front.Keywords.split(",").join(" ")}
            {card.Front.Keywords && card.Front.Traits && " - "}
            {card.Front.Traits.split(",").join(" ")}
          </Em>
          {card.Front.Text && (
            <Text fontSize="sm" fontFamily={"serif"} lineClamp="2">
              {card.Front.Text.replaceAll('\\"', '"')
                .split("\\r\\n")
                .flatMap((str) => [str, <br />])}
            </Text>
          )}
        </VStack>
      </Link>
    </Card.Root>
  );
};

{
  /* <Em fontFamily={"serif"}>
{card.Front.FlavorText?.replaceAll('\\"', '"')
  .split("\\r\\n")
  .map((str) => <p>{str}</p>)}
</Em> */
}

export default SmallCard;
