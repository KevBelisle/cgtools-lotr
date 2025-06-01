import { Tag } from "@/components/ui/tag";
import { Card as GameCard } from "@/lotr/lotr-schema";
import { Box, Card, Em, HStack, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { Tooltip } from "@/components/ui/tooltip";

import Attack from "@/lotr/icons/game icons/Attack.svg?react";
import Defense from "@/lotr/icons/game icons/Defense.svg?react";
import HitPoints from "@/lotr/icons/game icons/HitPoints.svg?react";
import Threat from "@/lotr/icons/game icons/Threat.svg?react";
import Willpower from "@/lotr/icons/game icons/Willpower.svg?react";

import Baggins from "@/lotr/icons/game icons/Baggins.svg?react";
import Fellowship from "@/lotr/icons/game icons/Fellowship.svg?react";
import Leadership from "@/lotr/icons/game icons/Leadership.svg?react";
import Lore from "@/lotr/icons/game icons/Lore.svg?react";
import Spirit from "@/lotr/icons/game icons/Spirit.svg?react";
import Tactics from "@/lotr/icons/game icons/Tactics.svg?react";

import Unique from "@/lotr/icons/game icons/Unique.svg?react";

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
      <VStack p={4} gap={2} alignItems="stretch">
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
                <Box color={borderColor} mt={"-1"}>
                  {sphereIcon}
                </Box>
              </Tooltip>
            )}
          </HStack>
        </Card.Title>

        <HStack justifyContent="space-between" flexWrap={"wrap"}>
          <HStack justifyContent="flex-end">
            <Tooltip content="Card type">
              <Tag fontFamily={"sans-serif"}>
                {card.Front.Type}
                {card.Front.Subtype && ` - ${card.Front.Subtype}`}
              </Tag>
            </Tooltip>
            {card.Front.ResourceCost != null && (
              <Tooltip content="Resource cost">
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
              </Tooltip>
            )}
            {card.Front.ThreatCost != null && (
              <Tooltip content="Threat cost">
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
              </Tooltip>
            )}
            {card.Front.QuestPoints != null && (
              <Tooltip content="Quest points">
                <Tag size="lg">
                  <Threat
                    style={{
                      display: "inline",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />{" "}
                  {card.Front.QuestPoints}
                </Tag>
              </Tooltip>
            )}
            {card.Front.EngagementCost != null && (
              <Tooltip content="Engagement cost">
                <Tag size="lg">
                  <Threat
                    style={{
                      display: "inline",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />{" "}
                  {card.Front.EngagementCost}
                </Tag>
              </Tooltip>
            )}
          </HStack>
          <HStack flexGrow={1} justifyContent="flex-end">
            {card.Front.ThreatStrength != null && (
              <Tooltip content="Threat strength">
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
              </Tooltip>
            )}

            {card.Front.Willpower != null && (
              <Tooltip content="Willpower">
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
              </Tooltip>
            )}
            {card.Front.Attack != null && (
              <Tooltip content="Attack">
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
              </Tooltip>
            )}
            {card.Front.Defense != null && (
              <Tooltip content="Defense">
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
              </Tooltip>
            )}
            {card.Front.HitPoints != null && (
              <Tooltip content="Hit points">
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
              </Tooltip>
            )}
          </HStack>
        </HStack>
        <Em fontSize="sm" fontFamily={"times, serif"}>
          {card.Front.Keywords.split(",").join(" ")}
          {card.Front.Keywords && card.Front.Traits && " - "}
          {card.Front.Traits.split(",").join(" ")}
        </Em>
        {card.Front.Text && (
          <Text fontSize="sm" fontFamily={"times, serif"} textWrap={"pretty"}>
            {card.Front.Text.replaceAll('\\"', '"')
              .split("\\r\\n")
              .flatMap((str, index) => [str, <br key={index} />])}
          </Text>
        )}
        {card.Front.VictoryPoints && (
          <Text
            fontSize="sm"
            fontFamily={"times, serif"}
            textWrap={"pretty"}
            fontWeight={"bold"}
            alignSelf={"flex-end"}
          >
            Victory {card.Front.VictoryPoints}.
          </Text>
        )}
      </VStack>
    </Card.Root>
  );
};

export default SmallCard;
