import ControlledInput from "@/components/ui/controlled-input";
import type { Card as GameCard } from "@/lotr/lotr-schema";
import { RCOFilter } from "@/lotr/rco-filter";
import { RCOOnlyFilterContext } from "@/lotr/rco-filter-provider";
import {
  Badge,
  Container,
  Group,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { ReactNode, useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useContext } from "react";
import { LuFilter } from "react-icons/lu";
import { DisplaySelect } from "../search/display-select";
import { OrderSelect } from "../search/sort-select";
import { SearchFilterContext } from "../ui/advanced-filters-provider";
import { DisplayContext } from "../ui/display-provider";

function CardResults({ cards }: { cards: GameCard[] }): ReactNode[] {
  const [displayOption] = useContext(DisplayContext);
  const DisplayComponent = displayOption.component;

  return cards.map((card) => {
    return (
      <DisplayComponent
        key={card.Slug}
        card={card}
        maxWidth="calc(100vw - 2 * var(--chakra-spacing-4))"
      />
    );
  });
}

const MemoizedCardResults = memo(CardResults, (prevProps, nextProps) => {
  // Only re-render if the cards array has changed
  return (
    prevProps.cards.length == nextProps.cards.length &&
    prevProps.cards.every(
      (card, index) => card.Slug === nextProps.cards[index]?.Slug,
    )
  );
});

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
  const [RCOOnlyFilter] = useContext(RCOOnlyFilterContext);
  //const [sortOrder] = useContext(SortOrderContext);
  //const router = useRouter();

  const onChange = useCallback((e: any) => setQuery(e.target.value), []);
  const navigate = useNavigate();

  const [searchFilters] = useContext(SearchFilterContext);
  const activeFiltersCount = searchFilters.filter(
    (filter) => filter.value !== undefined,
  ).length;

  return (
    <>
      <Container my={16} display="flex" flexDirection="column">
        <ControlledInput
          placeholder="Find by title..."
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
          borderBottomRightRadius={0}
        />
        <Group
          attached
          width="fit-content"
          alignSelf="flex-end"
          borderColor="sand.500"
          borderWidth={2}
          borderTopWidth={0}
          background="night.800"
          borderBottomRadius={6}
          color="sand.200"
        >
          <RCOFilter
            borderRightWidth="2px"
            borderRightStyle="solid"
            borderRightColor="sand.500"
            alignSelf="stretch"
            borderBottomLeftRadius={4}
            backgroundColor={RCOOnlyFilter.checked ? "teal.800" : "night.800"}
            color={RCOOnlyFilter.checked ? "white" : "sand.200"}
          />

          <IconButton
            size="lg"
            variant="subtle"
            background="transparent"
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
          <OrderSelect background="transparent" />
          <DisplaySelect background="transparent" />
        </Group>
      </Container>
      <Container my={16}>
        <SimpleGrid gap="6" minChildWidth={displayOption.minWidth ?? "450px"}>
          <MemoizedCardResults cards={cards} />
        </SimpleGrid>
      </Container>
    </>
  );
};
