import { config } from "@/lotr/config";
import {
  Box,
  Button,
  Link as ChakraLink,
  Container,
  HStack,
  Heading,
  Menu,
  VStack,
} from "@chakra-ui/react";
//import { CustomButtonLink } from "./customButtonLink";

import ReloadPrompt from "@/components/ui/reload-prompt";
import {
  Link,
  useCanGoBack,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { LuChevronDown, LuChevronLeft, LuExternalLink } from "react-icons/lu";
import { CustomButtonLink } from "./custom-button-link";

export default function NavBar() {
  const location = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <>
      <Container
        as="header"
        w="100vw"
        borderBottomColor="sand.800"
        borderBottomWidth={"1px"}
        background="night.900"
        color="white"
        mb={2}
      >
        <Box overflow="auto" py={2}>
          <VStack alignItems={"flex-start"} gap={0} float="left">
            <Link to="/cards/search" search={{ query: "" }}>
              <Heading as="h1">{config.gameName}</Heading>
              <Heading as="h2" size="xs" fontWeight={200}>
                by CardGame.Tools
              </Heading>
            </Link>
          </VStack>
          <HStack gap={4} float="right" height="46px" marginRight="1px">
            <ChakraLink
              href="https://old.lotr.cardgame.tools"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="xs"
              color="orange.300"
              mx={4}
            >
              Old Site <LuExternalLink />
            </ChakraLink>
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
            <Menu.Root>
              <Menu.Trigger>
                <Button size="xs" variant={"surface"}>
                  More <LuChevronDown />
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item asChild value="glossary" cursor="pointer">
                    <Link to="/glossary/search" search={{ query: "" }}>
                      Glossary
                    </Link>
                  </Menu.Item>
                  <Menu.Item asChild value="rulebooks" cursor="pointer">
                    <Link to="/rulebooks">Rulebooks</Link>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            <ReloadPrompt />
          </HStack>
        </Box>
      </Container>

      {canGoBack &&
      location !== "/cards/search" &&
      location !== "/glossary/search" &&
      location !== "/rulebooks" &&
      location !== "/products" ? (
        <Container mt="-1" height="0" overflow="visible">
          <Button
            onClick={() => router.history.back()}
            size="xs"
            variant="ghost"
            colorPalette="sand"
            zIndex={1000}
            ml="-4"
          >
            <LuChevronLeft />
            Back
          </Button>
        </Container>
      ) : null}
    </>
  );
}
