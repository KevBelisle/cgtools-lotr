import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { ChakraProvider } from "@/components/ui/chakra-provider";
import { SqljsProvider } from "@/sqljs/SqljsProvider";
import "./styles.css";

const hashHistory = createHashHistory();

// Set up a Router instance
const router = createRouter({
  routeTree,
  history: hashHistory,
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
  return (
    <StrictMode>
      <ChakraProvider>
        <SqljsProvider>
          <RouterProvider router={router} />
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
