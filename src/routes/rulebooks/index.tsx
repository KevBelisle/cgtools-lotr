import { kysely } from "@/lotr/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import {
  Box,
  Card,
  Container,
  Link as ExternalLink,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { Fragment } from "react";
import { TbFileTypeHtml, TbFileTypePdf } from "react-icons/tb";

export const Route = createFileRoute("/rulebooks/")({
  component: RouteComponent,

  loader: async ({ context }) => {
    const compiledQuery = kysely
      .selectFrom("rulebooks as r")
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
  const rulebooks = Route.useLoaderData();

  // REPACKAGED
  const repackaged = rulebooks.filter((rb) => rb.Product?.IsRepackage);

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
  const original = rulebooks.filter(
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

  const nightmare = rulebooks.filter(
    (rb) => rb.Product?.Type === "Nightmare_Expansion",
  );
  const pod = rulebooks.filter(
    (rb) =>
      !rb.Product?.IsRepackage && rb.Product?.Type === "Standalone_Scenario",
  );
  const noProduct = rulebooks.filter((rb) => !rb.Product);

  return (
    <Container
      display="flex"
      py={8}
      gap={8}
      flexDirection={"column"}
      maxW="6xl"
    >
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
            <RuleBookLinkList rulebooks={repackagedCore} />

            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Starter decks
            </Heading>
            <RuleBookLinkList rulebooks={repackagedStarterDecks} />

            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Cycles
            </Heading>
            {repackagedCycles.map(([cycleName, cycleRulebooks]) => (
              <Fragment key={cycleName}>
                <Heading size="md" textWrap="balance" mt={2} color="fg">
                  {cycleName} cycle
                </Heading>
                <RuleBookLinkList rulebooks={cycleRulebooks} />
              </Fragment>
            ))}

            <Heading size="lg" textWrap="balance" mt={2} color="fg">
              Lord of the Rings saga expansions
            </Heading>
            <RuleBookLinkList rulebooks={repackagedLotrSaga} />
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
              <RuleBookLinkList rulebooks={originalCore} />

              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                Cycles
              </Heading>
              {originalCycles.map(([cycleName, cycleRulebooks]) => (
                <Fragment key={cycleName}>
                  <Heading size="md" textWrap="balance" mt={2} color="fg">
                    {cycleName} cycle
                  </Heading>
                  <RuleBookLinkList rulebooks={cycleRulebooks} />
                </Fragment>
              ))}

              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                The Hobbit saga expansions
              </Heading>
              <RuleBookLinkList rulebooks={originalHobbitSaga} />

              <Heading size="lg" textWrap="balance" mt={2} color="fg">
                Lord of the Rings saga expansions
              </Heading>
              <RuleBookLinkList rulebooks={originalLotrSaga} />
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
              <RuleBookLinkList rulebooks={pod} />
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
              <RuleBookLinkList rulebooks={nightmare} />
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
              <RuleBookLinkList rulebooks={noProduct} />
            </Card.Description>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Container>
  );
}

function RuleBookLinkList({ rulebooks }: { rulebooks: any[] }) {
  return (
    <SimpleGrid gap={4} minChildWidth="sm" mt={4} mb={6}>
      {rulebooks.map((rb) => (
        <RuleBookLink rulebook={rb} key={rb.Filename} />
      ))}
    </SimpleGrid>
  );
}

function RuleBookLink({ rulebook }: { rulebook: any }) {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <ExternalLink
        href={`https://images.cardgame.tools/lotr/rules/${rulebook.Filename}.pdf`}
        target="_blank"
      >
        <IconButton
          size="xl"
          color="sand.800"
          _hover={{ color: "yellow.700" }}
          variant="outline"
        >
          <TbFileTypePdf style={{ width: "1.3em", height: "1.3em" }} />
        </IconButton>
      </ExternalLink>
      <Link to="/rulebooks/$rulebook" params={{ rulebook: rulebook.Filename }}>
        <IconButton
          size="xl"
          color="sand.800"
          _hover={{ color: "yellow.700" }}
          variant="outline"
        >
          <TbFileTypeHtml style={{ width: "1.3em", height: "1.3em" }} />
        </IconButton>
      </Link>
      <Box display="flex" flexDirection="column" color="fg" ml={2}>
        {rulebook.Title}
        <Text fontSize="sm" color="gray.emphasized">
          Source: {rulebook.Source}
        </Text>
      </Box>
    </Box>
  );
}
