import ControlledInput from "@/components/ui/controlled-input";
import type { Card as GameCard } from "@/lotr/lotr-schema";
import SmallCard from "@/lotr/small-card";
import {
  Badge,
  Container,
  Group,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { ReactNode, useNavigate } from "@tanstack/react-router";
import { useCallback, useContext } from "react";
import { LuFilter } from "react-icons/lu";
import { OrderSelect } from "../search/sort-select";
import { SearchFilterContext } from "../ui/advanced-filters-provider";

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
  const navigate = useNavigate();

  const [searchFilters, _] = useContext(SearchFilterContext);
  const activeFiltersCount = searchFilters.filter(
    (filter) => filter.value !== undefined,
  ).length;

  return (
    <Container mb="16">
      <Group attached my={16} width={"100%"}>
        <ControlledInput
          placeholder="Find by title..."
          value={query}
          onChange={onChange}
          size="lg"
          borderColor="sand.500"
          borderWidth={2}
          borderRightWidth={0}
          background="sand.50"
          variant="subtle"
          color="night.900"
        />

        <IconButton
          size="lg"
          borderColor="sand.500"
          borderWidth={2}
          borderLeftWidth={3}
          background="sand.100"
          variant="subtle"
          color="night.900"
          onClick={() =>
            navigate({ to: "/cards/search/advanced", search: { query } })
          }
        >
          {activeFiltersCount == 0 ? (
            <LuFilter />
          ) : (
            <>
              {" "}
              <LuFilter />
              <Badge
                size="xs"
                position={"absolute"}
                top={5}
                left={6}
                variant="solid"
              >
                {activeFiltersCount}
              </Badge>
            </>
          )}
        </IconButton>
        <OrderSelect />
      </Group>
      <SimpleGrid columns={[1, null, null, 2, null, 3]} gap="40px">
        {...cardResults}
      </SimpleGrid>
    </Container>
  );
};
