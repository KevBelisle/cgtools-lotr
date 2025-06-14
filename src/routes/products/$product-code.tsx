import { Tag } from "@/components/ui/tag";
import {
  cardBaseQuery,
  kysely,
  type CardBaseQueryResult,
} from "@/lotr/database-schema";
import sphereData from "@/lotr/display/sphere-data";
import { expansionIcons } from "@/lotr/expansion-icons";
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
  Text,
} from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";

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

    const compiledCardQuery = cardBaseQuery
      .leftJoin("productCards as pc", "pc.CardSlug", "c.Slug")
      .where("pc.ProductCode", "=", params["product-code"])
      .compile();

    const cardQueryResults = (
      execCompiledQuery(
        compiledCardQuery,
        context.sqljsDbContext.sqljsDb!,
      ) as CardBaseQueryResult[]
    )
      .map(lotrCardFromCardBaseQuery)
      .map((card) => {
        card.ProductCards = card.ProductCards.filter(
          (pc) => pc.Product.Code === params["product-code"],
        );
        return card;
      })
      .sort((a, b) => {
        const aNumber = a.ProductCards[0].Number;
        const bNumber = b.ProductCards[0].Number;
        return parseInt(aNumber) - parseInt(bNumber);
      });

    const repackagedCardCount = execCompiledQuery(
      kysely
        .selectFrom("productCards as pc")
        .leftJoin("productCards as pc2", "pc2.CardSlug", "pc.CardSlug")
        .leftJoin("products as p2", "p2.Code", "pc2.ProductCode")
        .where("pc.ProductCode", "=", params["product-code"])
        .where("p2.IsRepackage", "=", true)
        .select((eb) =>
          eb.fn.count<number>("pc.CardSlug").distinct().as("count"),
        )
        .compile(),
      context.sqljsDbContext.sqljsDb!,
    )[0].count;

    const repackageCardDistribution = execCompiledQuery(
      kysely
        .selectFrom("productCards as pc")
        .leftJoin("productCards as pc2", "pc2.CardSlug", "pc.CardSlug")
        .leftJoin("products as p2", "p2.Code", "pc2.ProductCode")
        .where("pc.ProductCode", "=", params["product-code"])
        .where("p2.IsRepackage", "=", true)
        .groupBy("p2.Name")
        .select("p2.Name")
        .select((eb) => eb.fn.countAll().as("count"))
        .compile(),
      context.sqljsDbContext.sqljsDb!,
    );

    const originalCardCount = execCompiledQuery(
      kysely
        .selectFrom("productCards as pc")
        .leftJoin("productCards as pc2", "pc2.CardSlug", "pc.CardSlug")
        .leftJoin("products as p2", "p2.Code", "pc2.ProductCode")
        .where("pc.ProductCode", "=", params["product-code"])
        .where("p2.IsRepackage", "=", false)
        .select((eb) =>
          eb.fn.count<number>("pc.CardSlug").distinct().as("count"),
        )
        .compile(),
      context.sqljsDbContext.sqljsDb!,
    )[0].count;

    const originalCardDistribution = execCompiledQuery(
      kysely
        .selectFrom("productCards as pc")
        .leftJoin("productCards as pc2", "pc2.CardSlug", "pc.CardSlug")
        .leftJoin("products as p2", "p2.Code", "pc2.ProductCode")
        .where("pc.ProductCode", "=", params["product-code"])
        .where("p2.IsRepackage", "=", false)
        .groupBy("p2.Name")
        .select("p2.Name")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .compile(),
      context.sqljsDbContext.sqljsDb!,
    );

    return {
      product: productQueryResult,
      cards: cardQueryResults,
      repackagedCardCount: repackagedCardCount,
      repackageCardDistribution: repackageCardDistribution,
      originalCardCount: originalCardCount,
      originalCardDistribution: originalCardDistribution,
    };
  },
});

function generateCardRows(card: Card, product: Product) {
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
      <GridItem color="gray.500" pr={2} textAlign="right">
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
      <GridItem display="flex" alignItems="center">
        <Text flexGrow={1}>
          <Link to="/cards/$card-slug" params={{ "card-slug": card.Slug }}>
            {card.Front.Title}
          </Link>
        </Text>
        <Tag>{card.Front.Type}</Tag>
        {SphereIcon ? (
          <Tag colorPalette={card.Front.Sphere?.toLowerCase() ?? "gray"} ml={2}>
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
        <GridItem>
          <Text color="gray.500" display="inline">
            Back:{" "}
          </Text>
          {card.Back!.Title}
          <Tag float="right">{card.Back!.Type}</Tag>
        </GridItem>
      </GridItem>,
    );
  }

  return cardRows;
}

function RouteComponent() {
  const {
    product,
    cards,
    repackagedCardCount,
    repackageCardDistribution,
    originalCardCount,
    originalCardDistribution,
  } = Route.useLoaderData();

  const cardRows = useMemo(
    () => cards.flatMap((card) => generateCardRows(card, product)),
    [cards, product],
  );

  let columnBreak = Math.ceil(cardRows.length / 2);
  if (cardRows[columnBreak].key?.endsWith("-BACK")) columnBreak += 1;

  const ProductIcon = product.ExpansionSymbol
    ? expansionIcons[product.ExpansionSymbol]
    : null;

  return (
    <Container display="flex" py={8} gap={8} flexDirection={"column"}>
      <Box as="header" display={"flex"} flexDirection="column" gap={4}>
        <Image
          objectFit="contain"
          alignSelf="center"
          width="100%"
          maxH="300px"
          src={`./product-images/${product.Code.toLowerCase()}_main.png`}
          aspectRatio={1}
          padding={2}
        />
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

        <Alert.Root status="info" colorPalette={"sand"} variant="surface">
          <Alert.Indicator />
          <Alert.Content>
            {product.IsRepackage ? (
              <>
                <Alert.Title pb={2}>
                  This is from the <b>repackaged content</b> for the game.
                </Alert.Title>
                <Alert.Description>
                  <Text fontSize="sm">
                    {originalCardCount} of its {cards.length} cards were
                    included in original releases
                    {originalCardCount >= 1 ? ":" : "."}
                  </Text>
                  <List.Root variant="marker" ml={4}>
                    {originalCardDistribution
                      .sort((a, b) => b.count - a.count)
                      .map((item) => (
                        <List.Item key={item.Name}>
                          {item.count} in {item.Name}
                        </List.Item>
                      ))}
                  </List.Root>
                </Alert.Description>
              </>
            ) : (
              <>
                <Alert.Title pb={2}>
                  This is from the <b>original release</b> of the game.
                </Alert.Title>
                <Alert.Description>
                  <Text fontSize="sm">
                    {repackagedCardCount} of its {cards.length} cards have been
                    included in repackaged content
                    {repackagedCardCount >= 1 ? ":" : "."}
                  </Text>
                  <List.Root variant="marker" ml={4}>
                    {repackageCardDistribution.map((item) => (
                      <List.Item key={item.Name}>
                        {item.count} in {item.Name}
                      </List.Item>
                    ))}
                  </List.Root>
                </Alert.Description>
              </>
            )}
          </Alert.Content>
        </Alert.Root>
      </Box>

      <Grid
        templateColumns="repeat(1, max-content max-content 1fr)"
        templateRows="auto"
        lg={{
          gridTemplateColumns: "repeat(2, max-content max-content 1fr)",
          gridTemplateRows: `repeat(${columnBreak}, auto)`,
          gridAutoFlow: "column",
        }}
        gapX={4}
        gapY={2}
        alignItems="baseline"
      >
        {cardRows}
      </Grid>
    </Container>
  );
}
