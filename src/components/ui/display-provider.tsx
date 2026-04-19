import { createContext, PropsWithChildren } from "react";

import { usePersistedState } from "@/components/search/use-persisted-state";

import { displayOptions, type DisplayOptionType } from "@/lotr/display-options";

export type DisplayContextType = [
  DisplayOptionType,
  React.Dispatch<React.SetStateAction<DisplayOptionType>>,
  DisplayOptionType[],
];

export const DisplayContext = createContext<DisplayContextType>([
  displayOptions[2],
  () => {},
  displayOptions,
]);

export function DisplayOptionProvider({
  displayOptions,
  persistedStateKey,
  defaultDisplayOption,
  children,
}: PropsWithChildren<{
  displayOptions: DisplayOptionType[];
  persistedStateKey: string;
  defaultDisplayOption?: string;
}>) {
  const fallbackName = defaultDisplayOption ?? displayOptions[2]?.name ?? displayOptions[0]?.name;
  const [displayOptionName, setDisplayOptionName] = usePersistedState<string>(
    persistedStateKey,
    fallbackName,
  );

  const displayOption =
    displayOptions.find((o) => o.name === displayOptionName) ??
    displayOptions[0];

  const setDisplayOption: (
    value:
      | DisplayOptionType
      | ((previousState: DisplayOptionType) => DisplayOptionType),
  ) => void | Promise<void> = (value) => {
    if (typeof value === "function") {
      setDisplayOptionName((prevName) => {
        const prevOption =
          displayOptions.find((o) => o.name === prevName) ?? displayOptions[0];
        const newValue = value(prevOption);
        return newValue.name;
      });
    } else {
      setDisplayOptionName(value.name);
    }
  };

  return (
    <DisplayContext.Provider
      value={[displayOption, setDisplayOption, displayOptions]}
    >
      {children}
    </DisplayContext.Provider>
  );
}
