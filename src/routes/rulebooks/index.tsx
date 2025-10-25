import { kysely } from "@/lotr/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import {
  Box,
  Card,
  Container,
  Link as ExternalLink,
  Heading,
  Icon,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { LuFileText } from "react-icons/lu";

export const Route = createFileRoute("/rulebooks/")({
  component: RouteComponent,

  loader: async ({ context }) => {
    const compiledQuery = kysely
      .selectFrom("ruleBooks as r")
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
    );

    return queryResult.map((row: any) => ({
      ...row,
      Product: row.Product ? JSON.parse(row.Product) : null,
    })) as typeof queryResult;
  },
});

function RouteComponent() {
  const ruleBooks = Route.useLoaderData();

  console.log(ruleBooks);

  // REPACKAGED
  const repackaged = ruleBooks.filter((rb) => rb.Product?.IsRepackage);

  const repackagedCore = repackaged.filter((x) => x.Product?.Type === "Core");
  const repackagedCycles = Array.from(
    repackaged
      .filter(
        (x) =>
          (x.Product?.Type === "Hero_Expansion" ||
            x.Product?.Type === "Campaign_Expansion") &&
          x.Product?.Cycle,
      )
      .reduce(
        (acc, x) => {
          acc.set(
            x.Product?.Cycle!,
            acc.get(x.Product!.Cycle!)?.concat(x) ?? [x],
          );
          return acc;
        },
        new Map() as Map<string, typeof repackaged>,
      ),
  );
  const repackagedLotrSaga = repackaged.filter(
    (x) =>
      x.Product?.Type === "Saga_Expansion" &&
      x.Product?.Cycle === "The Lord of the Rings",
  );
  const repackagedStarterDecks = repackaged.filter(
    (x) => x.Product?.Type === "Starter_Deck",
  );

  // ORIGINAL
  const original = ruleBooks.filter(
    (rb) =>
      rb.Product &&
      !rb.Product?.IsRepackage &&
      rb.Product?.Type !== "Standalone_Scenario" &&
      rb.Product?.Type !== "Nightmare_Expansion",
  );

  const originalCore = original.filter((x) => x.Product?.Type === "Core");
  const originalCycles = Array.from(
    original
      .filter(
        (x) =>
          (x.Product?.Type === "Deluxe_Expansion" ||
            x.Product?.Type === "Adventure_Pack") &&
          x.Product?.Cycle,
      )
      .reduce(
        (acc, x) => {
          acc.set(
            x.Product?.Cycle!,
            acc.get(x.Product!.Cycle!)?.concat(x) ?? [x],
          );
          return acc;
        },
        new Map() as Map<string, typeof original>,
      ),
  );
  const originalHobbitSaga = original.filter(
    (x) =>
      x.Product?.Type === "Saga_Expansion" && x.Product?.Cycle === "The Hobbit",
  );
  const originalLotrSaga = original.filter(
    (x) =>
      x.Product?.Type === "Saga_Expansion" &&
      x.Product?.Cycle === "The Lord of the Rings",
  );

  const nightmare = ruleBooks.filter(
    (rb) => rb.Product?.Type === "Nightmare_Expansion",
  );
  const pod = ruleBooks.filter(
    (rb) =>
      !rb.Product?.IsRepackage && rb.Product?.Type === "Standalone_Scenario",
  );
  const noProduct = ruleBooks.filter((rb) => !rb.Product);

  return (
    <Container display="flex" py={8} gap={8} flexDirection={"column"}>
      <Card.Root
        width="100%"
        variant="outline"
        borderWidth={2}
        borderStyle="solid"
        borderColor="teal.700"
        boxShadow={"0 2px 10px var(--chakra-colors-teal-800)"}
      >
        <Card.Body gap="2">
          <Card.Title
            mb="2"
            fontFamily="ringbearer"
            fontWeight="normal"
            fontSize="2xl"
            as="h2"
          >
            Repackaged Content
          </Card.Title>
          <Card.Description as="div">
            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Core
            </Heading>
            <RuleBookLinkList ruleBooks={repackagedCore} />

            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Starter decks
            </Heading>
            <RuleBookLinkList ruleBooks={repackagedStarterDecks} />

            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Cycles
            </Heading>
            {repackagedCycles.map(([cycleName, cycleRulebooks]) => (
              <>
                <Heading
                  key={cycleName}
                  size="md"
                  textWrap="balance"
                  mt={2}
                  color="fg"
                >
                  {cycleName} cycle
                </Heading>
                <RuleBookLinkList ruleBooks={cycleRulebooks} />
              </>
            ))}

            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Lord of the Rings saga expansions
            </Heading>
            <RuleBookLinkList ruleBooks={repackagedLotrSaga} />
          </Card.Description>
        </Card.Body>
      </Card.Root>

      <SimpleGrid gap={4} columns={{ base: 1, md: 2 }}>
        <Card.Root
          width="100%"
          variant="outline"
          borderWidth={2}
          borderStyle="solid"
          borderColor="red.700"
          gridColumn={{ base: "", md: "auto / span 2" }}
        >
          <Card.Body gap="2">
            <Card.Title
              mb="2"
              fontFamily="ringbearer"
              fontWeight="normal"
              fontSize="2xl"
              as="h2"
            >
              Original Releases
            </Card.Title>
            <Card.Description as="div">
              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                Core
              </Heading>
              <RuleBookLinkList ruleBooks={originalCore} />

              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                Cycles
              </Heading>
              {originalCycles.map(([cycleName, cycleRulebooks]) => (
                <>
                  <Heading
                    key={cycleName}
                    size="md"
                    textWrap="balance"
                    mt={2}
                    color="fg"
                  >
                    {cycleName} cycle
                  </Heading>
                  <RuleBookLinkList ruleBooks={cycleRulebooks} />
                </>
              ))}

              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                The Hobbit saga expansions
              </Heading>
              <RuleBookLinkList ruleBooks={originalHobbitSaga} />

              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                Lord of the Rings saga expansions
              </Heading>
              <RuleBookLinkList ruleBooks={originalLotrSaga} />
            </Card.Description>
          </Card.Body>
        </Card.Root>

        <Card.Root
          width="100%"
          variant="outline"
          borderWidth={2}
          borderStyle="solid"
        >
          <Card.Body gap="2">
            <Card.Title
              mb="2"
              fontFamily="ringbearer"
              fontWeight="normal"
              fontSize="2xl"
              as="h2"
            >
              Print-on-demand Scenarios
            </Card.Title>
            <Card.Description as="div">
              <RuleBookLinkList ruleBooks={pod} />
            </Card.Description>
          </Card.Body>
        </Card.Root>

        <Card.Root
          width="100%"
          variant="outline"
          borderWidth={2}
          borderStyle="solid"
        >
          <Card.Body gap="2">
            <Card.Title
              mb="2"
              fontFamily="ringbearer"
              fontWeight="normal"
              fontSize="2xl"
              as="h2"
            >
              Nightmare Decks
            </Card.Title>
            <Card.Description as="div">
              <RuleBookLinkList ruleBooks={nightmare} />
            </Card.Description>
          </Card.Body>
        </Card.Root>

        <Card.Root
          width="100%"
          variant="outline"
          borderWidth={2}
          borderStyle="solid"
          gridColumn={{ base: "", md: "auto / span 2" }}
        >
          <Card.Body gap="2">
            <Card.Title
              mb="2"
              fontFamily="ringbearer"
              fontWeight="normal"
              fontSize="2xl"
              as="h2"
            >
              General Documents
            </Card.Title>
            <Card.Description as="div">
              <RuleBookLinkList ruleBooks={noProduct} />
            </Card.Description>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Container>
  );
}

function RuleBookLinkList({ ruleBooks }: { ruleBooks: any[] }) {
  return (
    <SimpleGrid gap={4} minChildWidth="sm" mt={4} mb={6}>
      {ruleBooks.map((rb) => (
        <RuleBookLink ruleBook={rb} key={rb.Filename} />
      ))}
    </SimpleGrid>
  );
}

function RuleBookLink({ ruleBook }: { ruleBook: any }) {
  return (
    <ExternalLink
      href={`https://images.cardgame.tools/lotr/rules/${ruleBook.Filename}`}
      target="_blank"
    >
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Icon size="lg" color="yellow.700">
          <LuFileText />
        </Icon>
        <Box display="flex" flexDirection="column">
          {ruleBook.Title}
          <Text fontSize="sm" color="gray.emphasized">
            Source: {ruleBook.Source}
          </Text>
        </Box>
      </Box>
    </ExternalLink>
  );
}
