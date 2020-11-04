import React, { StrictMode } from "react";
import { render } from "react-dom";
import { CSSReset, ChakraProvider } from "@chakra-ui/core";

import { ReactComponent as Foo } from "assets/chakra_1.svg";

import ErrorBoundary from "components/ErrorBoundary";
import Splash from "components/Splash";

import "./styles.css";

const App = React.lazy(() => import("./App"));

const rootElement = document.getElementById("root");

render(
  <StrictMode>
    <ChakraProvider>
      <CSSReset />
      <ErrorBoundary>
        <React.Suspense fallback={<Splash />}>
          <App />
        </React.Suspense>
      </ErrorBoundary>
    </ChakraProvider>
  </StrictMode>,
  rootElement
);
