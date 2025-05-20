import { ChakraProvider as BaseProvider } from "@chakra-ui/react";
import theme from "./chakra-theme";
import { ColorModeProvider } from "./color-mode";

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseProvider value={theme}>
      <ColorModeProvider forcedTheme="dark">{children}</ColorModeProvider>
    </BaseProvider>
  );
}
