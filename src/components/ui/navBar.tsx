import { Box, HStack, Heading, Flex } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
//import { CustomButtonLink } from "./customButtonLink";

export default function NavBar() {
  return (
    <Box as="header" w="100vw" background="teal.800" color="white">
      <Flex zIndex={2000} justifyContent={"space-between"} py={2} px={8}>
        <HStack gap={8}>
          <Heading>Lord of the Rings LCG by CardGame.Tools</Heading>
        </HStack>
        <HStack gap={8}>
          {/* <CustomButtonLink
            to="/cards/search"
            search={{ query: "" }}
            textDecoration="none"
            colorPalette="teal"
          >
            Find Cards
          </CustomButtonLink> */}
          <ColorModeButton />
        </HStack>
      </Flex>
    </Box>
  );
}
