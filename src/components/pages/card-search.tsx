import { useCallback } from "react";
import { ReactNode } from "@tanstack/react-router";
import {
  Center,
  Container,
  Card,
  Box,
  Image,
  HStack,
  Badge,
  Separator,
  Em,
  SimpleGrid,
} from "@chakra-ui/react";

import { CustomLink } from "@/components/ui/custom-link";
import ControlledInput from "@/components/ui/controlled-input";

const LotrCard = ({
  slug,
  title,
  frontImageUrl,
  text,
  flavorText,
  sphere,
  type,
}: {
  slug: string;
  title: string | null;
  text: string | null;
  flavorText: string | null;
  frontImageUrl: string | null;
  sphere: string;
  type: string;
}) => (
  <Card.Root flexDirection="row" overflow="hidden">
    <Image
      objectFit="cover"
      maxW="200px"
      src={`https://images.cardgame.tools/lotr/sm/${frontImageUrl}`}
    />
    <Box>
      <Card.Body>
        <Card.Title>
          <CustomLink to="/cards/$cardSlug" params={{ cardSlug: slug }}>
            {title}
          </CustomLink>
        </Card.Title>
        <HStack>
          <Badge>{sphere}</Badge>
          <Badge>{type}</Badge>
        </HStack>
        <Card.Description>
          {text}
          <Separator />
          <Em fontFamily={"serif"}>{flavorText}</Em>
        </Card.Description>
      </Card.Body>
    </Box>
  </Card.Root>
);

export const CardSearch = ({
  query,
  setQuery,
  cards,
}: {
  query: string;
  setQuery: (query: string) => void;
  cards: {
    Slug: string;
    Title: string | null;
    Text: string | null;
    FlavorText: string | null;
    FrontImageUrl: string | null;
  }[];
}) => {
  let cardResults: ReactNode[] = [];

  if (cards.length > 0) {
    cardResults = cards.map(
      ({ Slug, Title, Text, FlavorText, FrontImageUrl }) => {
        return (
          <LotrCard
            key={Slug}
            slug={Slug}
            title={Title}
            frontImageUrl={FrontImageUrl}
            text={Text}
            flavorText={FlavorText}
            sphere={"FrontSphere" as string}
            type={"FrontType" as string}
          />
        );
      }
    );
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
