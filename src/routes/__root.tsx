import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Flex, Container, Text } from "@chakra-ui/react";
import { CustomButtonLink } from "@/components/ui/customButtonLink";
import { loadDatabase, SqljsDbProvider } from "@/sqljs/SqljsProvider";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { Toaster } from "@/components/ui/toaster";

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

const dbBufferPromise = loadDatabase("lotr_lcg_searchcols.db");

function RootComponent() {
  return (
    <>
      <NavBar />

      <Suspense fallback={<Loading />}>
        <SqljsDbProvider dbBufferPromise={dbBufferPromise}>
          <Outlet />
        </SqljsDbProvider>
      </Suspense>

      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
