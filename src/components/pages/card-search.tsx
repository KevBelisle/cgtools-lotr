import { useCallback } from "react";
import type { QueryExecResult } from "sql.js";
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
  imageUrl,
  text,
  flavorText,
  sphere,
  type,
}: {
  slug: string;
  title: string;
  imageUrl: string;
  text: string;
  flavorText: string;
  sphere: string;
  type: string;
}) => (
  <Card.Root flexDirection="row" overflow="hidden">
    <Image
      objectFit="cover"
      maxW="200px"
      src={`https://images.cardgame.tools/lotr/sm/${imageUrl}`}
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
  error,
  results,
}: {
  query: string;
  setQuery: (query: string) => void;
  error: string;
  results: QueryExecResult[];
}) => {
  let cardResults: ReactNode[] = [];

  if (results.length > 0) {
    cardResults = results[0].values.map((row) => {
      const [Slug, Title, Text, FlavorText, FrontImageUrl] = row;
      return (
        <LotrCard
          key={Slug as string}
          slug={Slug as string}
          title={Title as string}
          imageUrl={FrontImageUrl as string}
          text={Text as string}
          flavorText={FlavorText as string}
          sphere={"FrontSphere" as string}
          type={"FrontType" as string}
        />
      );
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
          colorPalette={"teal"}
          my={16}
          width={"70%"}
        />
      </Center>
      {error?.length > 0 && <div className=" text-red-600">{error}</div>}
      <SimpleGrid minChildWidth="lg" gap="40px">
        {...cardResults}
      </SimpleGrid>
    </Container>
  );
};
