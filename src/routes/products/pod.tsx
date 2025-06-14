import { kysely } from "@/lotr/database-schema";
import { ProductCard } from "@/lotr/display/product-card";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/pod")({
  component: RouteComponent,

  loader: async ({ context }) => {
    const compiledProductsQuery = kysely
      .selectFrom("products as p")
      .where("p.Type", "=", "Standalone_Scenario")
      .orderBy("p.FirstReleased", "asc")
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
          Print-on-demand scenarios
        </Heading>
      </Box>
      <Box as="main" display="flex" flexDirection="column" gap={4}>
        <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
          {products.map((product) => (
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
