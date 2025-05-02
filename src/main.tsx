import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { ChakraProvider } from "@/components/ui/chakra-provider";
import { loadDatabase, SqljsProvider } from "@/sqlite/SqljsProvider";
import "./styles.css";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
  basepath: "/cgtools-lotr/",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const dbBufferPromise = loadDatabase("lotr_lcg.sqlite3");

  return (
    <StrictMode>
      <ChakraProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <SqljsProvider dbBufferPromise={dbBufferPromise}>
            <RouterProvider router={router} />
          </SqljsProvider>
        </Suspense>
      </ChakraProvider>
    </StrictMode>
  );
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
