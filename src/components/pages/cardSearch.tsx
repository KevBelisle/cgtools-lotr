import type { QueryExecResult } from "sql.js";

import {
  Input,
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
import { ReactNode } from "@tanstack/react-router";

const LotrCard = ({
  title,
  imageUrl,
  text,
  flavorText,
  sphere,
  type,
}: {
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
        <Card.Title>{title}</Card.Title>
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
      const [
        Slug,
        FrontImageUrl,
        FrontTitle,
        FrontText,
        FrontFlavorText,
        FrontSphere,
        FrontType,
      ] = row;

      return (
        <LotrCard
          key={Slug as string}
          title={FrontTitle as string}
          imageUrl={FrontImageUrl as string}
          text={FrontText as string}
          flavorText={FrontFlavorText as string}
          sphere={FrontSphere as string}
          type={FrontType as string}
        />
      );
    });
  }

  return (
    <Container mb="16">
      <Center>
        <Input
          name="sqlQuery"
          placeholder="Find by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
          colorPalette={"teal"}
          my={16}
          width={"70%"}
        />
      </Center>
      {error.length > 0 && <div className=" text-red-600">{error}</div>}
      <SimpleGrid minChildWidth="lg" gap="40px">
        {...cardResults}
      </SimpleGrid>
    </Container>
  );
};
