import { Button, Container, Separator } from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { LuArrowLeft } from "react-icons/lu";

import { SearchFilters } from "@/components/search/search";
import { SearchFilterContext } from "@/components/ui/advanced-filters-provider";

type TitleSearch = {
  query: string;
};

export const Route = createFileRoute("/cards/search/advanced")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): TitleSearch => {
    return {
      query: search.query as string,
    };
  },
  loaderDeps: ({ search: { query } }) => ({ query }),
});

function RouteComponent() {
  const { query } = Route.useSearch();
  const [searchFilters, setSearchFilters] = useContext(SearchFilterContext);
  const navigate = useNavigate();

  return (
    <Container py={4}>
      <Button
        mb={4}
        onClick={() => navigate({ to: "/cards/search", search: { query } })}
        background="sand.100"
        variant="subtle"
        color="night.900"
        size="sm"
      >
        <LuArrowLeft /> Back to search
      </Button>
      <Separator mb={4} />
      <SearchFilters
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
      />
    </Container>
  );
}
