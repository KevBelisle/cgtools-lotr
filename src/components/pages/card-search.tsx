import ControlledInput from "@/components/ui/controlled-input";
import type { Card as GameCard } from "@/lotr/lotr-schema";
import {
  Badge,
  Box,
  Container,
  Group,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { ReactNode, useNavigate } from "@tanstack/react-router";
import { useCallback, useContext } from "react";
import { LuFilter } from "react-icons/lu";
import { DisplaySelect } from "../search/display-select";
import { OrderSelect } from "../search/sort-select";
import { SearchFilterContext } from "../ui/advanced-filters-provider";
import { DisplayContext } from "../ui/display-provider";

export const CardSearch = ({
  query,
  setQuery,
  cards,
}: {
  query: string;
  setQuery: (query: string) => void;
  cards: GameCard[];
}) => {
  const [displayOption] = useContext(DisplayContext);
  const DisplayComponent = displayOption.component;

  let cardResults: ReactNode[] = [];

  cardResults = cards.map((card) => {
    return <DisplayComponent key={card.Slug} card={card} />;
  });

  const onChange = useCallback((e: any) => setQuery(e.target.value), []);
  const navigate = useNavigate();

  const [searchFilters] = useContext(SearchFilterContext);
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
        <Box marginInlineEnd={"-2px"}>
          <IconButton
            size="lg"
            borderColor="sand.500"
            borderWidth={2}
            background="sand.100"
            variant="subtle"
            color="night.900"
            borderRadius={0}
            onClick={() =>
              navigate({ to: "/cards/search/advanced", search: { query } })
            }
          >
            {activeFiltersCount == 0 ? (
              <LuFilter />
            ) : (
              <>
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
        </Box>
        <OrderSelect />
        <DisplaySelect />
      </Group>
      <SimpleGrid columns={[1, null, null, 2, null, 3]} gap="6">
        {...cardResults}
      </SimpleGrid>
    </Container>
  );
};
