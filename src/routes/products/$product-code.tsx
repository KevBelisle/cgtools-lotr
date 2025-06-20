import { DisplaySelect } from "@/components/search/display-select";
import { DisplayContext } from "@/components/ui/display-provider";
import { Tag } from "@/components/ui/tag";
import {
  cardBaseQuery,
  kysely,
  type CardBaseQueryResult,
} from "@/lotr/database-schema";
import sphereData from "@/lotr/display/sphere-data";
import { expansionIcons } from "@/lotr/expansion-icons";
import type { Card as GameCard } from "@/lotr/lotr-schema";
import { Card, lotrCardFromCardBaseQuery, Product } from "@/lotr/lotr-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import {
  Alert,
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  List,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, ReactNode, useContext, useMemo, useState } from "react";

export const Route = createFileRoute("/products/$product-code")({
  component: RouteComponent,

  loader: async ({ params, context }) => {
    const compiledProductQuery = kysely
      .selectFrom("products as p")
      .where("p.Code", "=", params["product-code"])
      .selectAll()
      .limit(1)
      .compile();

    const productQueryResult = execCompiledQuery(
      compiledProductQuery,
      context.sqljsDbContext.sqljsDb!,
    )[0];

    const isRepackage = productQueryResult.IsRepackage;

    const compiledCardQuery = cardBaseQuery
      .leftJoin("productCards as pc", "pc.CardSlug", "c.Slug")
      .where("pc.ProductCode", "=", params["product-code"])
      .compile();

    let cardQueryResults = (
      execCompiledQuery(
        compiledCardQuery,
        context.sqljsDbContext.sqljsDb!,
      ) as CardBaseQueryResult[]
    ).map(lotrCardFromCardBaseQuery);

    let seenProductCardNumbers: Record<string, string[]> = {};

    cardQueryResults = cardQueryResults
      .map((card) => {
        // card.ProductCards = card.ProductCards.sort((a, b) =>
        //   a.Product.Code === params["product-code"]
        //     ? -1
        //     : b.Product.Code === params["product-code"]
        //       ? 1
        //       : 0,
        // );

        let { currentProductCards, otherProductsCards } = Object.groupBy(
          card.ProductCards,
          (pc) =>
            pc.Product.Code === params["product-code"]
              ? "currentProductCards"
              : "otherProductsCards",
        );

        // Annoying workaround for the TPLES that has 2 copies of Gandalf, with different numbers...
        if ((currentProductCards ?? []).length > 1) {
          debugger;

          let { alreadySeen, notYetSeen } = Object.groupBy(
            currentProductCards ?? [],
            (pc) =>
              seenProductCardNumbers[card.Slug]?.includes(pc.Number)
                ? "alreadySeen"
                : "notYetSeen",
          );
          currentProductCards = [...(notYetSeen ?? []), ...(alreadySeen ?? [])];

          seenProductCardNumbers[card.Slug] = [
            ...(seenProductCardNumbers[card.Slug] ?? []),
            currentProductCards[0].Number,
          ];
        }

        card.ProductCards = [
          ...(currentProductCards ?? []),
          ...(otherProductsCards ?? []),
        ];

        return card;
      })
      .sort((a, b) => {
        const aNumber = a.ProductCards[0].Number;
        const bNumber = b.ProductCards[0].Number;
        const aBackNumber = a.ProductCards[0].BackNumber ?? "";
        const bBackNumber = b.ProductCards[0].BackNumber ?? "";

        return (
          aNumber.localeCompare(bNumber, "en", { numeric: true }) ||
          aBackNumber.localeCompare(bBackNumber, "en", { numeric: true })
        );
      });

    const reprintedCardCount = execCompiledQuery(
      kysely
        .selectFrom("productCards as pc")
        .leftJoin("productCards as pc2", "pc2.CardSlug", "pc.CardSlug")
        .leftJoin("products as p2", "p2.Code", "pc2.ProductCode")
        .where("pc.ProductCode", "=", params["product-code"])
        .where("pc2.ProductCode", "!=", params["product-code"])
        .where("p2.IsRepackage", "=", !isRepackage)
        .select((eb) =>
          eb.fn.count<number>("pc.CardSlug").distinct().as("count"),
        )
        .compile(),
      context.sqljsDbContext.sqljsDb!,
    )[0].count;

    const reprintedCardDistribution = execCompiledQuery(
      kysely
        .selectFrom("productCards as pc")
        .innerJoin("productCards as pc2", "pc2.CardSlug", "pc.CardSlug")
        .innerJoin("products as p2", "p2.Code", "pc2.ProductCode")
        .where("pc.ProductCode", "=", params["product-code"])
        .where("pc2.ProductCode", "!=", params["product-code"])
        .where("p2.IsRepackage", "=", !isRepackage)
        .select(["pc.CardSlug", "pc2.ProductCode", "p2.Name"])
        .compile(),
      context.sqljsDbContext.sqljsDb!,
    );

    return {
      product: productQueryResult,
      cards: cardQueryResults,
      reprintedCardCount: reprintedCardCount,
      reprintedCardDistribution: reprintedCardDistribution,
    };
  },
});

const highlightColor = "yellow.700";

function CardResults({
  cards,
  highlightedCardSlugs,
}: {
  cards: GameCard[];
  highlightedCardSlugs: string[];
}): ReactNode[] {
  const [displayOption] = useContext(DisplayContext);
  const DisplayComponent = displayOption.component;

  return cards.map((card) => {
    const highlighted = highlightedCardSlugs
      ? highlightedCardSlugs.includes(card.Slug)
      : false;

    return (
      <DisplayComponent
        key={card.Slug}
        card={card}
        maxWidth="calc(100vw - 2 * var(--chakra-spacing-4))"
        highlighted={highlighted}
      />
    );
  });
}

const MemoizedCardResults = memo(CardResults, (prevProps, nextProps) => {
  // Only re-render if the cards array has changed
  return (
    prevProps.cards.length == nextProps.cards.length &&
    prevProps.cards.every(
      (card, index) => card.Slug === nextProps.cards[index]?.Slug,
    ) &&
    prevProps.highlightedCardSlugs.length ==
      nextProps.highlightedCardSlugs.length &&
    prevProps.highlightedCardSlugs.every(
      (slug, index) => slug === nextProps.highlightedCardSlugs[index],
    )
  );
});

function generateCardRows(card: Card, product: Product, highlighted: boolean) {
  const { SphereIcon } = sphereData(card.Front.Sphere);

  const ProductIcon = product.ExpansionSymbol
    ? expansionIcons[product.ExpansionSymbol]
    : null;

  const cardRows = [
    <GridItem
      display="grid"
      gridTemplateColumns="subgrid"
      key={card.Slug}
      gridColumnStart="span 3"
      alignItems="baseline"
    >
      <GridItem color="gray.500" textAlign="right">
        <Text fontSize="xs" textAlign="left">
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
          {card.ProductCards[0].Number}
        </Text>
      </GridItem>
      <GridItem color="gray.500" textAlign="right">
        <Text as="span" fontFamily={"monospace"}>
          {card.ProductCards[0].Quantity}
        </Text>{" "}
        x
      </GridItem>
      <GridItem
        display="flex"
        alignItems="center"
        px="1"
        backgroundColor={highlighted ? highlightColor : "transparent"}
        borderRadius="sm"
      >
        <Text flexGrow={1}>
          <Link to="/cards/$card-slug" params={{ "card-slug": card.Slug }}>
            {card.Front.Title}
          </Link>
        </Text>
        <Tag>
          {card.Front.Type}
          {card.Front.Subtype ? ` - ${card.Front.Subtype}` : null}
        </Tag>
        {SphereIcon ? (
          <Tag
            colorPalette={card.Front.Sphere?.toLowerCase() ?? "gray"}
            bg="night.900"
            ml={2}
          >
            <SphereIcon width="1em" height="1em" />
          </Tag>
        ) : null}
      </GridItem>
    </GridItem>,
  ];

  if (card.ProductCards[0].BackNumber) {
    cardRows.push(
      <GridItem
        display="grid"
        gridTemplateColumns="subgrid"
        key={`${card.Slug}-BACK`}
        gridColumnStart="span 3"
        alignItems="baseline"
      >
        <GridItem color="gray.500">
          <Text fontSize="xs" textAlign="left">
            {card.ProductCards[0].BackNumber != card.ProductCards[0].Number ? (
              <>
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
                {card.ProductCards[0].BackNumber}
              </>
            ) : null}
          </Text>
        </GridItem>
        <GridItem color="gray.500"></GridItem>
        <GridItem
          display="flex"
          alignItems="center"
          px="1"
          backgroundColor={highlighted ? highlightColor : "transparent"}
          borderRadius="sm"
        >
          <Text flexGrow={1}>
            <Text color="gray.500" display="inline" as="span">
              Back:{" "}
            </Text>
            {card.Back!.Title}
          </Text>
          <Tag float="right">
            {card.Back!.Type}
            {card.Back!.Subtype ? ` - ${card.Back!.Subtype}` : null}
          </Tag>
        </GridItem>
      </GridItem>,
    );
  }

  return cardRows;
}

function ReprintedCardsNotice({
  isRepackage,
  cardCount,
  reprintedCardCount,
  reprintedCardDistribution,
  hightlightedProductCodes,
  setHighlightedProductCodes,
}: {
  isRepackage: boolean;
  cardCount: number;
  reprintedCardCount: number;
  reprintedCardDistribution: {
    CardSlug: string;
    ProductCode: string;
    Name: string;
  }[];
  hightlightedProductCodes: string[];
  setHighlightedProductCodes: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const reprintedCardList = reprintedCardDistribution.reduce(
    (acc, item) => {
      acc[item.ProductCode] = acc[item.ProductCode] ?? {
        Name: item.Name,
        ProductCode: item.ProductCode,
        count: 0,
      };
      acc[item.ProductCode].count += 1;
      return acc;
    },
    {} as Record<string, { Name: string; ProductCode: string; count: number }>,
  );

  return (
    <Alert.Root status="info" colorPalette={"sand"} variant="surface">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title pb={2}>
          {isRepackage ? (
            <>
              This is from the <b>repackaged content</b> for the game.
            </>
          ) : (
            <>
              This is from the <b>original releases</b> of the game.
            </>
          )}
        </Alert.Title>
        <Alert.Description>
          <Text
            fontSize="sm"
            onClick={() =>
              setHighlightedProductCodes((prev) =>
                prev.length > 1 ? [] : Object.keys(reprintedCardList),
              )
            }
            bg={
              hightlightedProductCodes.length > 1
                ? highlightColor
                : "transparent"
            }
            px={1}
            borderRadius="sm"
            width="fit-content"
          >
            {reprintedCardCount} of its {cardCount} cards were included in
            {isRepackage ? " original releases" : " repackaged content"}
            {reprintedCardCount >= 1 ? ":" : "."}
          </Text>
          <List.Root variant="marker" ml={4} mt="1" gap="1">
            {Object.values(reprintedCardList)
              .sort((a, b) => b.count - a.count)
              .map((item) => {
                return hightlightedProductCodes.some(
                  (code) => code === item.ProductCode,
                ) ? (
                  <List.Item key={item.Name}>
                    <Text
                      onClick={() => setHighlightedProductCodes([])}
                      fontWeight="semibold"
                      bg={highlightColor}
                      width="fit-content"
                      py="0"
                      px="1"
                      borderRadius="sm"
                    >
                      {item.count} in {item.Name}
                    </Text>
                  </List.Item>
                ) : (
                  <List.Item key={item.Name}>
                    <Text
                      onClick={() =>
                        setHighlightedProductCodes([item.ProductCode])
                      }
                    >
                      {item.count} in {item.Name}
                    </Text>
                  </List.Item>
                );
              })}
          </List.Root>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

function RouteComponent() {
  const { product, cards, reprintedCardCount, reprintedCardDistribution } =
    Route.useLoaderData();

  const [displayOption] = useContext(DisplayContext);

  const ProductIcon = product.ExpansionSymbol
    ? expansionIcons[product.ExpansionSymbol]
    : null;

  let [hightlightedProductCodes, setHighlightedProductCodes] = useState(
    [] as string[],
  );

  const cardNotice = (
    <ReprintedCardsNotice
      isRepackage={product.IsRepackage}
      cardCount={cards.length}
      reprintedCardCount={reprintedCardCount}
      reprintedCardDistribution={reprintedCardDistribution}
      hightlightedProductCodes={hightlightedProductCodes}
      setHighlightedProductCodes={setHighlightedProductCodes}
    />
  );

  const highlightedCardSlugs = reprintedCardDistribution
    .filter((item) =>
      hightlightedProductCodes.some((code) => code === item.ProductCode),
    )
    .map((item) => item.CardSlug);

  const cardRows = useMemo(
    () =>
      cards.flatMap((card) =>
        generateCardRows(
          card,
          product,
          highlightedCardSlugs.some((x) => x === card.Slug),
        ),
      ),
    [cards, product, highlightedCardSlugs],
  );

  let columnBreak = Math.ceil(cardRows.length / 2);
  if (cardRows[columnBreak].key?.endsWith("-BACK")) columnBreak += 1;

  return (
    <Container display="flex" py={8} gap={8} flexDirection={"column"}>
      <Box
        as="header"
        display={"flex"}
        flexDirection="column"
        gap={4}
        md={{ flexDirection: "row", alignItems: "flex-end" }}
      >
        <Image
          objectFit="contain"
          alignSelf="flex-start"
          src={`./product-images/${product.Code.toLowerCase()}_main.png`}
          aspectRatio={1}
          padding={2}
          width="100%"
          maxH="300px"
          flexGrow={0}
          md={{ width: "300px", maxHeight: "300px" }}
        />
        <Box
          as="header"
          display={"flex"}
          flexDirection="column"
          gap={4}
          flexGrow={1}
        >
          <Heading
            fontFamily="ringbearer"
            size="4xl"
            fontWeight="normal"
            textWrap="balance"
          >
            {ProductIcon ? (
              <>
                <ProductIcon
                  width="1.4em"
                  height="1.4em"
                  style={{ display: "inline-block" }}
                />{" "}
              </>
            ) : null}
            {product.Name}
          </Heading>
          <HStack wrap="wrap">
            <Tag size="lg">
              Aka: {product.Code}, {product.Abbreviation}
            </Tag>
            <Tag size="lg">{product.Type}</Tag>
            <Tag size="lg">Cycle: {product.Cycle}</Tag>
            <Tag size="lg">{product.FirstReleased}</Tag>
          </HStack>

          {cardNotice}
        </Box>
      </Box>

      <Alert.Root
        status="info"
        colorPalette={"sand"}
        variant="surface"
        p={"1px"}
        pl={4}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        alignSelf="flex-end"
        width="fit-content"
        mb={-4}
      >
        <Text>View as: </Text>
        <DisplaySelect showLabel={true} size="sm" />
      </Alert.Root>

      {displayOption.name === "Card list" ? (
        <Grid
          templateColumns="repeat(1, max-content max-content 1fr)"
          templateRows="auto"
          lg={{
            gridTemplateColumns: "repeat(2, max-content max-content 1fr)",
            gridTemplateRows: `repeat(${columnBreak}, auto)`,
            gridAutoFlow: "column",
          }}
          gapX={2}
          gapY={2}
          alignItems="baseline"
        >
          {cardRows}
        </Grid>
      ) : (
        <SimpleGrid gap="6" minChildWidth={displayOption.minWidth ?? "450px"}>
          <MemoizedCardResults
            cards={cards}
            highlightedCardSlugs={highlightedCardSlugs}
          />
        </SimpleGrid>
      )}
    </Container>
  );
}
