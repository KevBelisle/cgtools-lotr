import { config } from "@/lotr/config";
import { Container, Flex, HStack, Heading, VStack } from "@chakra-ui/react";
//import { CustomButtonLink } from "./customButtonLink";

import ReloadPrompt from "@/components/ui/reload-prompt";

export default function NavBar() {
  return (
    <Container
      as="header"
      w="100vw"
      borderBottomColor="sand.800"
      borderBottomWidth={"1px"}
      background="night.900"
      color="white"
    >
      <Flex zIndex={2000} justifyContent={"space-between"} py={2}>
        <VStack alignItems={"flex-start"} gap={0}>
          <Heading as="h1">{config.gameName}</Heading>
          <Heading as="h2" size="xs" fontWeight={200}>
            by CardGame.Tools
          </Heading>
        </VStack>
        <HStack gap={8}>
          <ReloadPrompt />
        </HStack>
      </Flex>
    </Container>
  );
}
