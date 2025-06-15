import { config } from "@/lotr/config";
import { Button, Container, HStack, Heading, VStack } from "@chakra-ui/react";
//import { CustomButtonLink } from "./customButtonLink";

import ReloadPrompt from "@/components/ui/reload-prompt";
import {
  Link,
  useCanGoBack,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { LuChevronLeft } from "react-icons/lu";
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
          <HStack gap={4}>
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

      {canGoBack && location !== "/cards/search" && location !== "/products" ? (
        <Container>
          <Button
            onClick={() => router.history.back()}
            position="absolute"
            size="xs"
            mt={2}
            variant="surface"
            colorPalette="sand"
            zIndex={1000}
          >
            <LuChevronLeft />
            Back
          </Button>
        </Container>
      ) : null}
    </>
  );
}
