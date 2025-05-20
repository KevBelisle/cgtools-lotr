import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        sand: {
          50: { value: "#F3F3F2" },
          100: { value: "#DDDDDC" },
          200: { value: "#C8C8C6" },
          300: { value: "#B2B2B1" },
          400: { value: "#9D9D9B" },
          500: { value: "#878785" },
          600: { value: "#71716F" },
          700: { value: "#5C5C59" },
          800: { value: "#373736" },
          900: { value: "#20201F" },
          950: { value: "#080807" },
        },
        night: {
          50: { value: "#F1F1F4" },
          100: { value: "#DADADD" },
          200: { value: "#C2C2C5" },
          300: { value: "#ABABAE" },
          400: { value: "#939396" },
          500: { value: "#7C7C7F" },
          600: { value: "#656567" },
          700: { value: "#4D4D4F" },
          800: { value: "#363638" },
          900: { value: "#17181d" },
          950: { value: "#070709" },
        },
      },
    },
    semanticTokens: {
      colors: {},
    },
  },
});

export default createSystem(defaultConfig, config);
