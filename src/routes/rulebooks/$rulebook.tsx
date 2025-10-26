import { kysely } from "@/lotr/database-schema";
import { expansionIcons } from "@/lotr/expansion-icons";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import {
  Box,
  Card,
  Container,
  Heading,
  List,
  Separator,
  Text,
} from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import Markdown from "react-markdown";

export const Route = createFileRoute("/rulebooks/$rulebook")({
  component: RouteComponent,

  loader: async ({ params, context }) => {
    const mdUrl = `https://images.cardgame.tools/lotr/rules/${params["rulebook"]}.md`;

    const response = await fetch(mdUrl);
    const markdown = await response.text();

    const compiledQuery = kysely
      .selectFrom("rulebooks as r")
      .where("r.Filename", "=", params["rulebook"])
      .limit(1)
      .select((eb) => [
        "r.Filename as Filename",
        "r.Title as Title",
        "r.Source as Source",
        jsonObjectFrom(
          eb
            .selectFrom("products as p")
            .whereRef("p.Code", "=", "r.ProductCode")
            .select([
              "p.Code as Code",
              "p.Name as Name",
              "p.Type as Type",
              "p.Abbreviation as Abbreviation",
              "p.Cycle as Cycle",
              "p.FirstReleased as FirstReleased",
              "p.IsRepackage as IsRepackage",
              "p.ExpansionSymbol as ExpansionSymbol",
            ]),
        ).as("Product"),
      ])
      .compile();

    const queryResult = execCompiledQuery(
      compiledQuery,
      context.sqljsDbContext.sqljsDb!,
    )[0];

    return {
      markdown,
      rulebook: {
        ...queryResult,
        Product: queryResult.Product
          ? JSON.parse(queryResult.Product as unknown as string)
          : null,
      },
    };
  },
});

const markdownComponents = {
  h1: (props: any) => <Heading as="h1" size="2xl" mb={6} {...props} />,
  h2: (props: any) => <Heading as="h2" size="xl" mb={4} mt={6} {...props} />,
  h3: (props: any) => <Heading as="h3" size="lg" mb={4} mt={6} {...props} />,
  p: (props: any) => <Text fontSize="lg" mb={4} {...props} />,
  ul: (props: any) => (
    <List.Root as="ul" fontSize="lg" mb={4} pl={8} {...props} />
  ),
  ol: (props: any) => (
    <List.Root as="ol" fontSize="lg" mb={4} pl={8} {...props} />
  ),
  li: (props: any) => <List.Item fontSize="lg" mb={1} {...props} />,
};

function RouteComponent() {
  const { markdown, rulebook } = Route.useLoaderData();
  const product = rulebook.Product;

  const ProductIcon = product.ExpansionSymbol
    ? expansionIcons[product.ExpansionSymbol]
    : null;

  return (
    <Container py={8} maxW="4xl">
      <Text
        fontFamily="sans-serif"
        fontSize="sm"
        color="gray.700"
        textAlign="right"
        mr={2}
        mb={2}
      >
        Warning: The rules text below was transcribed by an LLM and probably
        contains errors.
      </Text>
      <Card.Root bg="gray.900" overflow="hidden">
        <Card.Header
          bg="gray.950"
          borderBottomWidth="1px"
          borderBottomStyle="solid"
          py={4}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box fontFamily="ringbearer" fontWeight="normal" fontSize="lg">
            {ProductIcon ? (
              <>
                <ProductIcon
                  width="1.4em"
                  height="1.4em"
                  style={{ display: "inline-block" }}
                />{" "}
              </>
            ) : null}
            <Link
              to="/products/$product-code"
              params={{ "product-code": product.Code }}
            >
              {product.Name}
            </Link>
          </Box>
        </Card.Header>
        <Card.Body>
          <Heading
            size="4xl"
            mt={4}
            mb={8}
            textAlign="center"
            fontFamily="ringbearer"
            fontWeight="normal"
          >
            {rulebook.Title}
          </Heading>
          <Separator mb={6} variant="dotted" />
          <Box fontFamily="EB Garamond, times, serif">
            <Markdown components={markdownComponents}>{markdown}</Markdown>
          </Box>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
