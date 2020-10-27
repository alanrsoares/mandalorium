import React from "react";
import { render } from "react-dom";
import { CSSReset, ChakraProvider } from "@chakra-ui/core";

import "./styles.css";
import App from "./App";

const rootElement = document.getElementById("root");

render(
  <ChakraProvider>
    <CSSReset />
    <App />
  </ChakraProvider>,
  rootElement
);
