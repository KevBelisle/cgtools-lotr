import { createContext, PropsWithChildren } from "react";

import { SearchFilterType } from "@/components/search/types";
import { usePersistedState } from "@/components/search/use-persisted-state";
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
  const [searchFilters, setSearchFilters] = usePersistedState<SearchFilterType>(
    "SearchFilterContext",
    defaultSearchFilters,
  );

  return (
    <SearchFilterContext.Provider value={[searchFilters, setSearchFilters]}>
      {children}
    </SearchFilterContext.Provider>
  );
}
