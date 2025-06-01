import { createContext, PropsWithChildren } from "react";

import { usePersistedState } from "@/components/search/use-persisted-state";

import type { DisplayOptionType } from "@/lotr/display-options";
import { displayOptions } from "@/lotr/display-options";

export type DisplayContextType = [
  DisplayOptionType,
  React.Dispatch<React.SetStateAction<DisplayOptionType>>,
];

export const DisplayContext = createContext<DisplayContextType>([
  displayOptions[0],
  () => {},
]);

export function DisplayOptionProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [displayOptionIndex, setDisplayOptionIndex] = usePersistedState<number>(
    "DisplayContext",
    0,
  );

  const displayOption = displayOptions[displayOptionIndex];

  const setDisplayOption: (
    value:
      | DisplayOptionType
      | ((previousState: DisplayOptionType) => DisplayOptionType),
  ) => void | Promise<void> = (value) => {
    if (typeof value === "function") {
      setDisplayOptionIndex((prevIndex) => {
        const newValue = value(displayOptions[prevIndex]);
        return displayOptions.indexOf(newValue);
      });
    } else {
      setDisplayOptionIndex(displayOptions.indexOf(value));
    }
  };

  return (
    <DisplayContext.Provider value={[displayOption, setDisplayOption]}>
      {children}
    </DisplayContext.Provider>
  );
}
