import { StrictMode, useCallback, useContext } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider as TanstackRouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { ChakraProvider } from "@/components/ui/chakra-provider";
import {
  SqljsDbContext,
  SqljsDbProvider,
  SqljsProvider,
} from "@/sqljs/sqljs-provider";
import "./styles.css";
import Loading from "@/components/ui/loading";

const hashHistory = createHashHistory();

// Set up a Router instance
const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: "intent",
  defaultStaleTime: Infinity,
  defaultPreloadStaleTime: Infinity,
  scrollRestoration: true,
  context: {
    sqljsDbContext: undefined!,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const RouterProvider = () => {
  const sqljsDbContext = useContext(SqljsDbContext);
  return (
    <TanstackRouterProvider
      router={router}
      context={{
        sqljsDbContext: sqljsDbContext,
      }}
    />
  );
};

const App = () => {
  const loading = useCallback(
    (progress: number) => (
      <Loading message="Loading database file..." progress={progress} />
    ),
    []
  );

  return (
    <StrictMode>
      <ChakraProvider>
        <SqljsProvider>
          <SqljsDbProvider dbUrl={"lotr_lcg.db"} loading={loading}>
            <RouterProvider />
          </SqljsDbProvider>
        </SqljsProvider>
      </ChakraProvider>
    </StrictMode>
  );
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
