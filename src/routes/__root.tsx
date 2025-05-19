import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Flex, Container, Text } from "@chakra-ui/react";
import { CustomButtonLink } from "@/components/ui/custom-button-link";
import { Toaster } from "@/components/ui/toaster";

import NavBar from "@/components/ui/nav-bar";

interface RouterContext {
  test: any;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <Container my="16">
        <Flex flexDirection={"column"} alignItems={"center"} gap="4">
          <Text>This is the notFoundComponent configured on root route.</Text>
          <CustomButtonLink to="/" colorPalette="teal">
            Start Over
          </CustomButtonLink>
        </Flex>
      </Container>
    );
  },
});

function RootComponent() {
  return (
    <>
      <NavBar />
      <Outlet />

      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
}
