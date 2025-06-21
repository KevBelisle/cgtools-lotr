import { Tag } from "@/components/ui/tag";
import { CardSide } from "@/lotr/lotr-schema";
import {
  Box,
  Card,
  Tag as ChakraTag,
  Em,
  HStack,
  IconButton,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { LuUndo } from "react-icons/lu";

import { Tooltip } from "@/components/ui/tooltip";
import { formatCardText, formatNumber } from "@/lotr/card-text-formatting";

import Attack from "@/lotr/icons/game icons/Attack.svg?react";
import Defense from "@/lotr/icons/game icons/Defense.svg?react";
import HitPoints from "@/lotr/icons/game icons/HitPoints.svg?react";
import Threat from "@/lotr/icons/game icons/Threat.svg?react";
import Willpower from "@/lotr/icons/game icons/Willpower.svg?react";

import Unique from "@/lotr/icons/game icons/Unique.svg?react";
import { Fragment } from "react";

export function CardSideInfo({
  cardSide,
  cardSlug,
  borderColor,
  SphereIcon,
  hasBack,
  onFlipCard,
  showFlavorText = false,
}: {
  cardSide: CardSide;
  cardSlug: string;
  borderColor: string;
  SphereIcon: React.FC<React.SVGAttributes<SVGElement>> | null;
  hasBack: boolean;
  onFlipCard: () => void;
  showFlavorText?: boolean;
}) {
  return (
    <>
      <Card.Header
        fontFamily={"vafthrudnir"}
        fontVariant={"small-caps"}
        fontWeight={"normal"}
        fontSize="2xl"
      >
        <HStack justifyContent="space-between">
          <Link to="/cards/$card-slug" params={{ "card-slug": cardSlug }}>
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
          {SphereIcon ? (
            <Tooltip content={cardSide.Sphere}>
              <Box color={borderColor} mt={"-1"}>
                <SphereIcon
                  style={{
                    display: "inline-block",
                    width: "2.2rem",
                    height: "2.2rem",
                  }}
                />
              </Box>
            </Tooltip>
          ) : null}
        </HStack>
      </Card.Header>
      <Card.Body position="relative" pt={1}>
        <VStack gap={2} alignItems="stretch">
          <HStack justifyContent="space-between" flexWrap={"wrap"}>
            <HStack justifyContent="flex-end">
              <Tooltip content="Card type">
                <Tag
                  size="lg"
                  variant="subtle"
                  fontFamily="EB Garamond, times, serif"
                >
                  {cardSide.Type}
                  {cardSide.Subtype && ` - ${cardSide.Subtype}`}
                </Tag>
              </Tooltip>
              {cardSide.ResourceCost != null && (
                <Tooltip content="Resource cost">
                  <ChakraTag.Root size="lg" variant={"subtle"}>
                    <ChakraTag.Label display="flex" flexDir="row" gap="1">
                      <Text fontFamily="EB Garamond, times, serif">Cost:</Text>
                      <Text
                        fontFamily={"vafthrudnir"}
                        style={{ transform: "translate(0, 3px)" }}
                      >
                        {formatNumber(cardSide.ResourceCost)}
                      </Text>
                    </ChakraTag.Label>
                  </ChakraTag.Root>
                </Tooltip>
              )}
              {cardSide.ThreatCost != null && (
                <Tooltip content="Threat cost">
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <Threat
                        style={{
                          display: "inline",
                          height: "1rem",
                          width: "1rem",
                        }}
                      />{" "}
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.ThreatCost)}
                      </span>
                    </HStack>
                  </Tag>
                </Tooltip>
              )}
              {cardSide.QuestPoints != null && (
                <Tooltip content="Quest points">
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <Threat
                        style={{
                          display: "inline",
                          height: "1rem",
                          width: "1rem",
                        }}
                      />{" "}
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.QuestPoints)}
                      </span>
                    </HStack>
                  </Tag>
                </Tooltip>
              )}
              {cardSide.EngagementCost != null && (
                <Tooltip content="Engagement cost">
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <Threat
                        style={{
                          display: "inline",
                          height: "1rem",
                          width: "1rem",
                        }}
                      />{" "}
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.EngagementCost)}
                      </span>
                    </HStack>
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
                        {formatNumber(cardSide.ThreatStrength)}
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
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.Willpower)}
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
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.Attack)}
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
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.Defense)}
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
                  <Tag size="lg" fontFamily={"vafthrudnir"} variant={"subtle"}>
                    <HStack gap="1">
                      <span style={{ transform: "translate(0, 3px)" }}>
                        {formatNumber(cardSide.HitPoints)}
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
              {cardSide.Text.split(/[\n\r]+/)
                .flatMap((str, index) => [
                  <Fragment key={`${index}-0`}>{formatCardText(str)}</Fragment>,
                  <br key={`${index}-1`} style={{ marginBottom: "0.5rem" }} />,
                ])
                .slice(0, -1)}
            </Text>
          )}

          {cardSide.Text && cardSide.ShadowEffect ? (
            <Separator borderColor={borderColor} variant={"dotted"} my={1} />
          ) : null}

          {cardSide.ShadowEffect && (
            <Text textWrap={"pretty"} fontStyle={"italic"}>
              <b>Shadow:</b>{" "}
              {cardSide.ShadowEffect.split(/[\n\r]+/)
                .flatMap((str, index) => [
                  <Fragment key={`${index}-0`}>{str}</Fragment>,
                  <br key={`${index}-1`} style={{ marginBottom: "0.5rem" }} />,
                ])
                .slice(0, -1)}
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

          {(cardSide.Text || cardSide.ShadowEffect || cardSide.VictoryPoints) &&
          showFlavorText &&
          cardSide.FlavorText ? (
            <Separator borderColor={borderColor} variant={"dotted"} my={1} />
          ) : null}
          {showFlavorText && cardSide.FlavorText && (
            <Text textWrap={"pretty"} fontStyle={"italic"}>
              {cardSide.FlavorText.split(/[\n\r]+/)
                .flatMap((str, index) => [
                  <Fragment key={`${index}-0`}>{str}</Fragment>,
                  <br key={`${index}-1`} style={{ marginBottom: "0.5rem" }} />,
                ])
                .slice(0, -1)}
            </Text>
          )}

          {hasBack && (
            <IconButton
              variant="ghost"
              onClick={onFlipCard}
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
    </>
  );
}
