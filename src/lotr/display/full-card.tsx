import { Tag } from "@/components/ui/tag";
import { Card as GameCard } from "@/lotr/lotr-schema";
import {
  Box,
  Card,
  Em,
  HStack,
  type HTMLChakraProps,
  IconButton,
  List,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";
import { LuUndo } from "react-icons/lu";

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

    var backgroundColor = "";
    var borderColor = "";
    var sphereIcon = null;

    switch (cardSide.Sphere) {
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
        {...rootProps}
      >
        <Card.Header
          fontFamily={"vafthrudnir"}
          fontVariant={"small-caps"}
          fontWeight={"normal"}
          fontSize="2xl"
        >
          <HStack justifyContent="space-between">
            <Link to="/cards/$card-slug" params={{ "card-slug": card.Slug }}>
              <span>
                {cardSide.IsUnique ? (
                  <Unique
                    style={{
                      display: "inline",
                      height: "1.4rem",
                      width: "1.4rem",
                    }}
                  />
                ) : (
                  ""
                )}
                {cardSide.Stage ? (
                  <Text as="span" fontSize="xl" color="sand.500">
                    {cardSide.Stage}
                  </Text>
                ) : (
                  ""
                )}{" "}
                {cardSide.Title}
              </span>
            </Link>
            {cardSide.Sphere && (
              <Tooltip content={cardSide.Sphere}>
                <Box color={borderColor} mt={"-1"}>
                  {sphereIcon}
                </Box>
              </Tooltip>
            )}
          </HStack>
        </Card.Header>

        <Card.Body position="relative" pt={1}>
          <VStack gap={2} alignItems="stretch">
            <HStack justifyContent="space-between" flexWrap={"wrap"}>
              <HStack justifyContent="flex-end">
                <Tooltip content="Card type">
                  <Tag fontFamily={"sans-serif"}>
                    {cardSide.Type}
                    {cardSide.Subtype && ` - ${cardSide.Subtype}`}
                  </Tag>
                </Tooltip>
                {cardSide.ResourceCost != null && (
                  <Tooltip content="Resource cost">
                    <Tag size="lg" variant={"subtle"}>
                      <HStack>
                        <Text>Cost:</Text>
                        <Text
                          fontFamily={"vafthrudnir"}
                          style={{ transform: "translate(0, 3px)" }}
                        >
                          {cardSide.ResourceCost}
                        </Text>
                      </HStack>
                    </Tag>
                  </Tooltip>
                )}
                {cardSide.ThreatCost != null && (
                  <Tooltip content="Threat cost">
                    <Tag
                      size="lg"
                      fontFamily={"vafthrudnir"}
                      variant={"subtle"}
                    >
                      <Threat
                        style={{
                          display: "inline",
                          height: "1rem",
                          width: "1rem",
                        }}
                      />{" "}
                      {cardSide.ThreatCost}
                    </Tag>
                  </Tooltip>
                )}
                {cardSide.QuestPoints != null && (
                  <Tooltip content="Quest points">
                    <Tag
                      size="lg"
                      fontFamily={"vafthrudnir"}
                      variant={"subtle"}
                    >
                      <Threat
                        style={{
                          display: "inline",
                          height: "1rem",
                          width: "1rem",
                        }}
                      />{" "}
                      {cardSide.QuestPoints}
                    </Tag>
                  </Tooltip>
                )}
                {cardSide.EngagementCost != null && (
                  <Tooltip content="Engagement cost">
                    <Tag
                      size="lg"
                      fontFamily={"vafthrudnir"}
                      variant={"subtle"}
                    >
                      <Threat
                        style={{
                          display: "inline",
                          height: "1rem",
                          width: "1rem",
                        }}
                      />{" "}
                      {cardSide.EngagementCost}
                    </Tag>
                  </Tooltip>
                )}
              </HStack>
              <HStack flexGrow={1} justifyContent="flex-end">
                {cardSide.ThreatStrength != null && (
                  <Tooltip content="Threat strength">
                    <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                      <HStack gap="1">
                        <span style={{ transform: "translate(0, 3px)" }}>
                          {cardSide.ThreatStrength}
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

                {cardSide.Willpower != null && (
                  <Tooltip content="Willpower">
                    <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                      <HStack gap="1">
                        <span style={{ transform: "translate(0, 3px)" }}>
                          {cardSide.Willpower}
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
                {cardSide.Attack != null && (
                  <Tooltip content="Attack">
                    <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                      <HStack gap="1">
                        <span style={{ transform: "translate(0, 3px)" }}>
                          {cardSide.Attack}
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
                {cardSide.Defense != null && (
                  <Tooltip content="Defense">
                    <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                      <HStack gap="1">
                        <span style={{ transform: "translate(0, 3px)" }}>
                          {cardSide.Defense}
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
                {cardSide.HitPoints != null && (
                  <Tooltip content="Hit points">
                    <Tag fontFamily={"vafthrudnir"} variant={"subtle"}>
                      <HStack gap="1">
                        <span style={{ transform: "translate(0, 3px)" }}>
                          {cardSide.HitPoints}
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
            <Em>
              {cardSide.Keywords.split(",").join(" ")}
              {cardSide.Keywords && cardSide.Traits && " - "}
              {cardSide.Traits.split(",").join(" ")}
            </Em>
            {cardSide.Text && (
              <Text textWrap={"pretty"}>
                {cardSide.Text.replaceAll('\\"', '"')
                  .split("\\r\\n")
                  .flatMap((str, index) => [str, <br key={index} />])}
              </Text>
            )}
            {cardSide.VictoryPoints && (
              <Text
                textWrap={"pretty"}
                fontWeight={"bold"}
                alignSelf={"flex-end"}
              >
                Victory {cardSide.VictoryPoints}.
              </Text>
            )}
            {(cardSide.Text || cardSide.VictoryPoints) &&
            cardSide.FlavorText ? (
              <Separator borderColor={borderColor} variant={"dotted"} />
            ) : null}
            {cardSide.FlavorText && (
              <Text textWrap={"pretty"} fontStyle={"italic"}>
                {cardSide.FlavorText.replaceAll('\\"', '"')
                  .split("\\r\\n")
                  .flatMap((str, index) => [str, <br key={index} />])}
              </Text>
            )}

            {hasBack && (
              <IconButton
                variant="ghost"
                onClick={flipCard}
                size="sm"
                position="absolute"
                bottom={0}
                right={0}
              >
                <LuUndo />
              </IconButton>
            )}
          </VStack>
        </Card.Body>

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
                {pc.Quantity}x in{" "}
                <Link
                  to="/products/$product-code"
                  params={{ "product-code": pc.Product.Code }}
                >
                  {pc.Product.Name}
                </Link>{" "}
                {pc.Product.Cycle && !pc.Product.IsRepackage && (
                  <Text as="span" color="sand.500">
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
