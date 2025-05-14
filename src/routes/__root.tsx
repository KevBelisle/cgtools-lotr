import { useCallback } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Flex, Container, Text } from "@chakra-ui/react";
import { CustomButtonLink } from "@/components/ui/customButtonLink";
import { SqljsDbProvider } from "@/sqljs/SqljsProvider";
import Loading from "@/components/ui/loading";
import { Toaster } from "@/components/ui/toaster";
import ReloadPrompt from "@/components/ui/reload-prompt";

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

const dbUrl = "lotr_lcg.db";

function RootComponent() {
  const loading = useCallback(
    (progress: number) => (
      <Loading message="Loading database file..." progress={progress} />
    ),
    []
  );

  return (
    <>
      <NavBar />
      <SqljsDbProvider dbUrl={dbUrl} loading={loading}>
        <Outlet />
      </SqljsDbProvider>

      <ReloadPrompt />

      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
}
