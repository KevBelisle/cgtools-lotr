import ControlledInput from "@/components/ui/controlled-input";
import { GlossaryTermCard } from "@/components/ui/glossary-term";
import { kysely } from "@/lotr/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import {
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

type GlossarySearch = {
  query: string;
};

export const Route = createFileRoute("/glossary/search/")({
  component: GlossarySearchRouteComponent,

  validateSearch: (search: Record<string, unknown>): GlossarySearch => {
    return {
      query: search.query as string,
    };
  },
  loaderDeps: ({ search: { query } }) => ({ query }),
  staleTime: 0,
  preloadStaleTime: 0,

  loader: async ({ context, deps: { query: glossarySearch } }) => {
    const compiledGlossaryQuery = kysely
      .selectFrom("glossary as g")
      .where((eb) => eb("g.Term", "like", `%${glossarySearch}%`))
      .orderBy("g.Term", "asc")
      .selectAll()
      .compile();

    const glossaryQueryResults = execCompiledQuery(
      compiledGlossaryQuery,
      context.sqljsDbContext.sqljsDb!,
    );

    return { glossary: glossaryQueryResults };
  },
});

function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

function GlossarySearchRouteComponent() {
  const { query: urlQuery } = Route.useSearch();
  const [query, rawSetQuery] = useState(urlQuery);
  const results = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const debouncedNavigate = debounce(navigate, 300);

  // Immediately setQuery in local state
  // and then navigate after a delay to avoid too many navigations and DB queries
  const setQuery = (query: string) => {
    rawSetQuery(query);
    debouncedNavigate({
      search: (prev: any) => {
        return { ...prev, query: query };
      },
      replace: true,
    });
  };

  const onChange = useCallback((e: any) => setQuery(e.target.value), []);

  return (
    <>
      <Container my={16} display="flex" flexDirection="column">
        <ControlledInput
          placeholder="Find a term to define..."
          value={query}
          onChange={onChange}
          size="lg"
          borderColor="sand.500"
          borderWidth={2}
          background="sand.50"
          variant="subtle"
          color="night.900"
          alignSelf="stretch"
          borderRadius={6}
        />
      </Container>

      <Container my={16}>
        <SimpleGrid gap="6" minChildWidth={"450px"}>
          {results.glossary.map(
            ({ Term, Type, Definition, SeeAlso, Source }) => (
              <GlossaryTermCard
                key={Term}
                Term={Term}
                Type={Type}
                Definition={Definition}
                SeeAlso={SeeAlso}
                Source={Source}
              />
            ),
          )}
        </SimpleGrid>
      </Container>
    </>
  );
}
