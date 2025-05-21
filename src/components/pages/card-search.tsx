import { useCallback } from "react";
import { ReactNode } from "@tanstack/react-router";
import { Center, Container, SimpleGrid } from "@chakra-ui/react";

import type { Card as GameCard } from "@/lotr-schema";
import ControlledInput from "@/components/ui/controlled-input";
import SmallCard from "@/lotr/small-card";

export const CardSearch = ({
  query,
  setQuery,
  cards,
}: {
  query: string;
  setQuery: (query: string) => void;
  cards: GameCard[];
}) => {
  let cardResults: ReactNode[] = [];

  if (cards.length > 0) {
    cardResults = cards.map((card) => {
      return <SmallCard key={card.Slug} card={card} />;
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
          borderColor="sand.500"
          borderWidth={2}
          background="sand.50"
          color="night.900"
        />
      </Center>
      <SimpleGrid minChildWidth="md" gap="40px">
        {...cardResults}
      </SimpleGrid>
    </Container>
  );
};
