import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Flex, Container, Text } from "@chakra-ui/react";
import { CustomButtonLink } from "@/components/ui/customButtonLink";

import NavBar from "@/components/ui/navBar";

export const Route = createRootRoute({
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
      {/* Start rendering router matches */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
