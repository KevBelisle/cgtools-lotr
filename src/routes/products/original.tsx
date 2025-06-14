import { kysely } from "@/lotr/database-schema";
import { ProductCard } from "@/lotr/display/product-card";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
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
  const sagaProducts = products.filter((x) => x.Type === "Saga_Expansion");
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
      <Box as="main" display="flex" flexDirection="column" gap={4}>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {coreProducts.map((product) => (
            <ProductCard key={product.Code} product={product} />
          ))}
        </SimpleGrid>

        <Heading size="lg" textWrap="balance" mt={4}>
          Cycles
        </Heading>
        {cycles.map(([cycleName, cycleProducts]) => (
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
          {sagaProducts.map((product) => (
            <ProductCard key={product.Code} product={product} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
