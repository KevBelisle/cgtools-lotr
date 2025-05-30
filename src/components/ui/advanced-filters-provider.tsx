import { createContext, PropsWithChildren, useState } from "react";

import { SearchFilterType } from "@/components/search/types";
import { defaultSearchFilters } from "@/lotr/search-filters";

export type SearchFilterContextType = [
  SearchFilterType,
  React.Dispatch<React.SetStateAction<SearchFilterType>>,
];

export const SearchFilterContext = createContext<SearchFilterContextType>([
  defaultSearchFilters,
  () => {},
]);

export function SearchFilterProvider({ children }: PropsWithChildren<unknown>) {
  const [searchFilters, setSearchFilters] =
    useState<SearchFilterType>(defaultSearchFilters);

  return (
    <SearchFilterContext.Provider value={[searchFilters, setSearchFilters]}>
      {children}
    </SearchFilterContext.Provider>
  );
}
