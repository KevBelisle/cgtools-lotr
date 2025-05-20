import { useCallback } from "react";
import { ReactNode } from "@tanstack/react-router";
import {
  Center,
  Container,
  Card as ChakraCard,
  Box,
  Image,
  HStack,
  Badge,
  Separator,
  Em,
  SimpleGrid,
} from "@chakra-ui/react";

import type { Card as Card } from "@/lotr-schema";
import { CustomLink } from "@/components/ui/custom-link";
import ControlledInput from "@/components/ui/controlled-input";

const LotrCard = ({ card }: { card: Card }) => (
  <ChakraCard.Root flexDirection="row" overflow="hidden">
    <Image
      objectFit="cover"
      maxW="200px"
      src={`https://images.cardgame.tools/lotr/sm/${card.ProductCard?.FrontImageUrl}`}
    />
    <Box>
      <ChakraCard.Body>
        <ChakraCard.Title>
          <CustomLink to="/cards/$cardSlug" params={{ cardSlug: card.Slug }}>
            {card.Front.Title}
          </CustomLink>
        </ChakraCard.Title>
        <HStack>
          <Badge>{card.Front.Sphere}</Badge>
          <Badge>{card.Front.Type}</Badge>
        </HStack>
        <ChakraCard.Description>
          <Box>
            {card.Front.Text?.replaceAll('\"', '"')
              .split("\\r\\n")
              .map((str) => <p>{str}</p>)}
          </Box>
          <Separator />
          <Em fontFamily={"serif"}>
            {card.Front.FlavorText?.replaceAll('\\"', '"')
              .split("\\r\\n")
              .map((str) => <p>{str}</p>)}
          </Em>
        </ChakraCard.Description>
      </ChakraCard.Body>
    </Box>
  </ChakraCard.Root>
);

export const CardSearch = ({
  query,
  setQuery,
  cards,
}: {
  query: string;
  setQuery: (query: string) => void;
  cards: Card[];
}) => {
  let cardResults: ReactNode[] = [];

  if (cards.length > 0) {
    cardResults = cards.map((card) => {
      console.log("flavor", card.Front.FlavorText);
      return <LotrCard key={card.Slug} card={card} />;
    });
  }

  const onChange = useCallback((e: any) => setQuery(e.target.value), []);

  return (
    <Container mb="16">
      <Center>
        <ControlledInput
          name="sqlQuery"
          placeholder="Find by title..."
          value={query}
          onChange={onChange}
          size="lg"
          my={16}
          variant="subtle"
          borderColor="sand.800"
        />
      </Center>
      <SimpleGrid minChildWidth="lg" gap="40px">
        {...cardResults}
      </SimpleGrid>
    </Container>
  );
};
