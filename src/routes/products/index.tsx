import { Button, Card, Container, SimpleGrid, Text } from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LuChevronRight } from "react-icons/lu";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
});

function RouteComponent() {
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
            <Text pb="2">
              In October 2021, FFG announced the Revised Core Set for the Lord
              of the Rings LCG, and have since repackaged many of the original
              products.
            </Text>
            <Text>
              This includes the Revised Core Set, the Lord of the Rings Saga
              Expansions, the Hero and Campaign expansions, the 4 starter decks
              and one scenario pack.
            </Text>
          </Card.Description>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Link to="/products/repackaged">
            <Button variant="subtle" colorPalette="teal">
              View all repackaged content <LuChevronRight />
            </Button>
          </Link>
        </Card.Footer>
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
              <Text>
                In addition to the original core set, the original releases for
                Lord of the Rings LCG included 9 cycles (each with a deluxe
                expansion and 6 adventure packs) as well as 8 Saga expansions
                retelling the story of the Lord of the Rings and the Hobbit.
              </Text>
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Link to="/products/original">
              <Button variant="subtle" colorPalette="red">
                View all original releases <LuChevronRight />
              </Button>
            </Link>
          </Card.Footer>
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
              Print-on-demand scenarios
            </Card.Title>
            <Card.Description as="div">
              <Text>
                FFG produced a number of print-on-demand scenarios for the Lord
                of the Rings LCG, which were used to run events at conventions
                or in local game stores.
              </Text>
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Link to="/products/pod">
              <Button variant="subtle">
                View all print-on-demand scenarios <LuChevronRight />
              </Button>
            </Link>
          </Card.Footer>
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
              <Text pb={2}>
                For many of the original releases, FFG produced Nightmare Decks,
                which were designed to make the original scenarios more
                challenging or to refine the scenarios.
              </Text>
              <Text>
                There are Nightmare Decks available for 6 of the 9 cycles, and 6
                of 8 saga expansions.
              </Text>
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Link to="/products/nightmare">
              <Button variant="subtle">
                View all nightmare decks <LuChevronRight />
              </Button>
            </Link>
          </Card.Footer>
        </Card.Root>
      </SimpleGrid>
    </Container>
  );
}
