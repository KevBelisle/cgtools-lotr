import { createContext, PropsWithChildren, useState } from "react";

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
  const [sortOrder, setSortOrder] = useState<SortOrderType>("Random");

  return (
    <SortOrderContext.Provider value={[sortOrder, setSortOrder]}>
      {children}
    </SortOrderContext.Provider>
  );
}
