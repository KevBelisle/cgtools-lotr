import { kysely } from "@/lotr/database-schema";
import { ProductCard } from "@/lotr/display/product-card";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/nightmare")({
  component: RouteComponent,

  loader: async ({ context }) => {
    const compiledProductsQuery = kysely
      .selectFrom("products as p")
      .where("p.Type", "=", "Nightmare_Expansion")
      .selectAll()
      .compile();

    const productsQueryResults = execCompiledQuery(
      compiledProductsQuery,
      context.sqljsDbContext.sqljsDb!,
    );

    return { products: productsQueryResults };
  },
});

function RouteComponent() {
  const { products } = Route.useLoaderData();

  const groups = Object.fromEntries(
    products.reduce(
      (acc, product) => {
        acc.set(
          product.Cycle!,
          acc.get(product.Cycle!)?.concat(product) ?? [product],
        );
        return acc;
      },
      new Map() as Map<string, typeof products>,
    ),
  );

  const {
    Core: core,
    "The Lord of the Rings": lotr,
    "The Hobbit": hobbit,
    ...cycles
  } = groups;

  return (
    <Container display="flex" py={8} gap={8} flexDirection={"column"}>
      <Box as="header" display={"flex"} flexDirection="column" gap={4}>
        <Heading size="4xl" textWrap="balance">
          Nightmare Decks
        </Heading>
      </Box>
      <Box as="main" display="flex" flexDirection="column" gap={4}>
        <Heading size="lg" textWrap="balance" mt={4}>
          Core
        </Heading>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {core.map((product) => (
            <ProductCard
              key={product.Code}
              product={product}
              gridColumn={
                product.Type === "Deluxe_Expansion"
                  ? { base: "", md: "auto / span 2" }
                  : undefined
              }
            />
          ))}
        </SimpleGrid>

        <Heading size="lg" textWrap="balance" mt={4}>
          Cycles
        </Heading>
        {Object.entries(cycles).map(([cycleName, cycleProducts]) => (
          <>
            <Heading key={cycleName} size="sm" textWrap="balance" my={2}>
              {cycleName}
            </Heading>
            <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
              {cycleProducts.map((product) => (
                <ProductCard
                  key={product.Code}
                  product={product}
                  gridColumn={
                    product.Type === "Deluxe_Expansion"
                      ? { base: "", md: "auto / span 2" }
                      : undefined
                  }
                />
              ))}
            </SimpleGrid>
          </>
        ))}

        <Heading size="lg" textWrap="balance" mt={4}>
          The Hobbit & Lord of the Rings Sagas
        </Heading>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {[...hobbit, ...lotr].map((product) => (
            <ProductCard
              key={product.Code}
              product={product}
              gridColumn={
                product.Type === "Deluxe_Expansion"
                  ? { base: "", md: "auto / span 2" }
                  : undefined
              }
            />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
