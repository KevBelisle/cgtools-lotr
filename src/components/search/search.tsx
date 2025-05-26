import { Separator, VStack } from "@chakra-ui/react";
import { InputFilter } from "./input-filter";
import { RangeFilter } from "./range-filter";
import { MultiselectFilter } from "./multiselect-filter";
import { SearchFilterType } from "./types";

export function SearchFilters({
  searchFilters,
  setSearchFilters,
}: {
  searchFilters: SearchFilterType;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilterType>>;
}) {
  return (
    <VStack align="stretch" gap={4} separator={<Separator />}>
      {searchFilters
        .filter((filter) => filter.id != "Search_Title")
        .map((filter) => {
          switch (filter.type) {
            case "input":
              return (
                <InputFilter
                  filter={filter}
                  onChange={setSearchFilters}
                  id={filter.id}
                  key={filter.id}
                />
              );
            case "range":
              return (
                <RangeFilter
                  filter={filter}
                  onChange={setSearchFilters}
                  id={filter.id}
                  key={filter.id}
                />
              );
            case "multiselect":
              return (
                <MultiselectFilter
                  filter={filter}
                  onChange={setSearchFilters}
                  id={filter.id}
                  key={filter.id}
                />
              );
          }
        })}
    </VStack>
  );
}
