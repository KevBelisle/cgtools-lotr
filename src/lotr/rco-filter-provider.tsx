import { usePersistedState } from "@/components/search/use-persisted-state";
import { createContext, PropsWithChildren } from "react";

type RCOFilterType = { checked: boolean };
const defaultRCOFilter: RCOFilterType = { checked: true };

export type RCOOnlyFilterContextType = [
  RCOFilterType,
  React.Dispatch<React.SetStateAction<RCOFilterType>>,
];

export const RCOOnlyFilterContext = createContext<RCOOnlyFilterContextType>([
  defaultRCOFilter,
  () => {},
]);

export function RCOOnlyFilterProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [RCOOnlyFilter, setRCOOnlyFilter] = usePersistedState<RCOFilterType>(
    "RCOOnlyFilterContext",
    defaultRCOFilter,
  );

  return (
    <RCOOnlyFilterContext.Provider value={[RCOOnlyFilter, setRCOOnlyFilter]}>
      {children}
    </RCOOnlyFilterContext.Provider>
  );
}
