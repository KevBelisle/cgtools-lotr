import { kysely } from "@/lotr/database-schema";
import { ProductCard } from "@/lotr/display/product-card";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/repackaged")({
  component: RouteComponent,

  loader: async ({ context }) => {
    const compiledProductsQuery = kysely
      .selectFrom("products as p")
      .where("p.IsRepackage", "=", true)
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

  return (
    <Container display="flex" py={8} gap={8} flexDirection={"column"}>
      <Box as="header" display={"flex"} flexDirection="column" gap={4}>
        <Heading size="4xl" textWrap="balance">
          Repackaged Content
        </Heading>
      </Box>
      <Box as="main" display="flex" flexDirection="column" gap={4}>
        <ProductCard product={products.find((x) => x.Type === "Core")!} />

        <Heading size="lg" textWrap="balance" mt={4}>
          Repackaged Cycles
        </Heading>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {products
            .filter(
              (x) =>
                x.Type === "Hero_Expansion" || x.Type === "Campaign_Expansion",
            )
            .map((product) => (
              <ProductCard key={product.Code} product={product} />
            ))}
        </SimpleGrid>

        <Heading size="lg" textWrap="balance" mt={4}>
          Repackaged Lord of the Rings Saga
        </Heading>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {products
            .filter((x) => x.Type === "Saga_Expansion")
            .map((product) => (
              <ProductCard key={product.Code} product={product} />
            ))}
        </SimpleGrid>

        <Heading size="lg" textWrap="balance" mt={4}>
          Starter Decks
        </Heading>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {products
            .filter((x) => x.Type === "Starter_Deck")
            .map((product) => (
              <ProductCard key={product.Code} product={product} />
            ))}
        </SimpleGrid>

        <Heading size="lg" textWrap="balance" mt={4}>
          Scenario Pack
        </Heading>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {products
            .filter((x) => x.Type === "Scenario_Pack")
            .map((product) => (
              <ProductCard key={product.Code} product={product} />
            ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
