import type { QueryExecResult } from "sql.js";

import { Input, Center, Container, Box } from "@chakra-ui/react";

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
      <Box>{JSON.stringify(results)}</Box>
    </Container>
  );
};
