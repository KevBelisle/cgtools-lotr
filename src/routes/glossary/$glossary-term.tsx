import { GlossaryTermCard } from "@/components/ui/glossary-term";
import { kysely } from "@/lotr/database-schema";
import execCompiledQuery from "@/sqljs/exec-compiled-query";
import { Container } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/glossary/$glossary-term")({
  component: RouteComponent,

  loader: async ({ params, context }) => {
    const compiledQuery = kysely
      .selectFrom("glossary as g")
      .where("g.Term", "=", params["glossary-term"])
      .limit(1)
      .selectAll()
      .compile();

    const queryResult = execCompiledQuery(
      compiledQuery,
      context.sqljsDbContext.sqljsDb!,
    )[0];

    return queryResult as {
      Term: string;
      Type: string;
      Definition: string;
      SeeAlso: string | null;
      Source: string | null;
    };
  },
});

function RouteComponent() {
  const glossaryTerm = Route.useLoaderData();

  return (
    <Container py={8} maxW="4xl">
      <GlossaryTermCard
        Term={glossaryTerm.Term}
        Type={glossaryTerm.Type}
        Definition={glossaryTerm.Definition}
        SeeAlso={glossaryTerm.SeeAlso}
        Source={glossaryTerm.Source}
      />
    </Container>
  );
}
