import { config } from "@/lotr/config";
import { Container, Flex, HStack, Heading, VStack } from "@chakra-ui/react";
//import { CustomButtonLink } from "./customButtonLink";

import ReloadPrompt from "@/components/ui/reload-prompt";
import { Link } from "@tanstack/react-router";

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
          <Link to="/cards/search" search={{ query: "" }}>
            <Heading as="h1">{config.gameName}</Heading>
            <Heading as="h2" size="xs" fontWeight={200}>
              by CardGame.Tools
            </Heading>
          </Link>
        </VStack>
        <HStack gap={8}>
          <Link to="/cards/search" search={{ query: "" }}>
            Search
          </Link>
          <ReloadPrompt />
        </HStack>
      </Flex>
    </Container>
  );
}
