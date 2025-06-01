import { createContext, PropsWithChildren } from "react";

import { usePersistedState } from "@/components/search/use-persisted-state";

import { sortOptions } from "@/lotr/sort-options";

export type SortOrderType = keyof typeof sortOptions | "Random";

export type SortOrderContextType = [
  SortOrderType,
  React.Dispatch<React.SetStateAction<SortOrderType>>,
];

export const SortOrderContext = createContext<SortOrderContextType>([
  "Random",
  () => {},
]);

export function SortOrderProvider({ children }: PropsWithChildren<unknown>) {
  const [sortOrder, setSortOrder] = usePersistedState<SortOrderType>(
    "SortOrderContext",
    "Random",
  );

  return (
    <SortOrderContext.Provider value={[sortOrder, setSortOrder]}>
      {children}
    </SortOrderContext.Provider>
  );
}
