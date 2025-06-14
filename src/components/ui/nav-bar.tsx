import { config } from "@/lotr/config";
import { Container, HStack, Heading, VStack } from "@chakra-ui/react";
//import { CustomButtonLink } from "./customButtonLink";

import ReloadPrompt from "@/components/ui/reload-prompt";
import { Link } from "@tanstack/react-router";
import { CustomButtonLink } from "./custom-button-link";

export default function NavBar() {
  return (
    <>
      <Container
        as="header"
        w="100vw"
        borderBottomColor="sand.800"
        borderBottomWidth={"1px"}
        background="night.900"
        color="white"
      >
        <HStack justifyContent={"space-between"} py={2}>
          <VStack alignItems={"flex-start"} gap={0}>
            <Link to="/cards/search" search={{ query: "" }}>
              <Heading as="h1">{config.gameName}</Heading>
              <Heading as="h2" size="xs" fontWeight={200}>
                by CardGame.Tools
              </Heading>
            </Link>
          </VStack>
          <HStack gap={8}>
            <CustomButtonLink
              to="/cards/search"
              search={{ query: "" }}
              size="xs"
              variant={"surface"}
              preload={"intent"}
            >
              Cards
            </CustomButtonLink>
            <CustomButtonLink
              to="/products"
              search={{ query: "" }}
              size="xs"
              variant={"surface"}
              preload={"intent"}
            >
              Products
            </CustomButtonLink>
            <ReloadPrompt />
          </HStack>
        </HStack>
      </Container>
    </>
  );
}
