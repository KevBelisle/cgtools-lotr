"use client";

import {
  ChakraProvider as BaseProvider,
  defaultSystem,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function ChakraProvider(props: ColorModeProviderProps) {
  return (
    <BaseProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </BaseProvider>
  );
}
