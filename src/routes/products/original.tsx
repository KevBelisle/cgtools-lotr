import { kysely } from "@/lotr/database-schema";
import { ProductCard } from "@/lotr/display/product-card";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/original")({
  component: RouteComponent,

  loader: async ({ context }) => {
    const compiledProductsQuery = kysely
      .selectFrom("products as p")
      .where("p.IsRepackage", "=", false)
      .where("p.Type", "not in", ["Standalone_Scenario", "Nightmare_Expansion"])
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

  const coreProducts = products.filter((x) => x.Type === "Core");
  const hobbitSagaProducts = products.filter(
    (x) => x.Type === "Saga_Expansion" && x.Cycle === "The Hobbit",
  );
  const lotrSagaProducts = products.filter(
    (x) => x.Type === "Saga_Expansion" && x.Cycle === "The Lord of the Rings",
  );
  const cycles = Array.from(
    products
      .filter(
        (x) =>
          (x.Type === "Deluxe_Expansion" || x.Type === "Adventure_Pack") &&
          x.Cycle,
      )
      .reduce(
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

  return (
    <Container display="flex" py={8} gap={8} flexDirection={"column"}>
      <Box as="header" display={"flex"} flexDirection="column" gap={4}>
        <Heading size="4xl" textWrap="balance">
          Original Releases
        </Heading>
      </Box>
      <Box as="main" display="flex" flexDirection="column" gap={2}>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {coreProducts.map((product) => (
            <ProductCard key={product.Code} product={product} />
          ))}
        </SimpleGrid>

        <Heading size="xl" textWrap="balance" mt={4}>
          Cycles
        </Heading>
        {cycles.map(([cycleName, cycleProducts]) => (
          <>
            <Heading key={cycleName} size="md" textWrap="balance" mt={2}>
              {cycleName} cycle
            </Heading>
            <Text mb="2" fontSize="sm" color="gray.500">
              {["Angmar Awakened", "Dream-chaser", "Ered Mithrin"].some(
                (x) => x === cycleName,
              )
                ? "This cycle has been repackaged as a Hero Expansion & Compaign Expansion."
                : "This cycle has not been repackaged and is only available in its original release format."}
            </Text>
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
          The Hobbit saga expansions
        </Heading>
        <Text mb="2" fontSize="sm" color="gray.500">
          These saga expansions have not been repackaged and are only available
          in their original release format.
        </Text>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {hobbitSagaProducts.map((product) => (
            <ProductCard key={product.Code} product={product} />
          ))}
        </SimpleGrid>

        <Heading size="lg" textWrap="balance" mt={4}>
          Lord of the Rings saga expansions
        </Heading>
        <Text mb="2" fontSize="sm" color="gray.500">
          These saga expansions have been repackaged as 3 saga expansions.
        </Text>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {lotrSagaProducts.map((product) => (
            <ProductCard key={product.Code} product={product} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
