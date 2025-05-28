import {
  RouterProvider as TanstackRouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";
import { StrictMode, useCallback, useContext } from "react";
import ReactDOM from "react-dom/client";

import {
  SearchFilterContext,
  SearchFilterProvider,
} from "@/components/ui/advanced-filters-provider";
import { ChakraProvider } from "@/components/ui/chakra-provider";
import {
  SqljsDbContext,
  SqljsDbProvider,
  SqljsProvider,
} from "@/sqljs/sqljs-provider";

import Loading from "@/components/ui/loading";
import {
  SortOrderContext,
  SortOrderProvider,
} from "@/components/ui/sort-order-provider";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const hashHistory = createHashHistory();

// Set up a Router instance
const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: "intent",
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultPreloadStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultGcTime: 5 * 60 * 1000, // 5 minutes
  scrollRestoration: true,
  context: {
    sqljsDbContext: undefined!,
    searchFilterContext: [undefined!, () => {}],
    sortOrderContext: ["Random", () => {}],
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
  const searchFilterContext = useContext(SearchFilterContext);
  const sortOrderContext = useContext(SortOrderContext);
  return (
    <TanstackRouterProvider
      router={router}
      context={{
        searchFilterContext: searchFilterContext,
        sqljsDbContext: sqljsDbContext,
        sortOrderContext: sortOrderContext,
      }}
    />
  );
};

const App = () => {
  const loading = useCallback(
    (progress: number) => (
      <Loading message="Loading database file..." progress={progress} />
    ),
    [],
  );

  return (
    <StrictMode>
      <ChakraProvider>
        <SqljsProvider>
          <SqljsDbProvider dbUrl={"lotr_lcg.db"} loading={loading}>
            <SearchFilterProvider>
              <SortOrderProvider>
                <RouterProvider />
              </SortOrderProvider>
            </SearchFilterProvider>
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
