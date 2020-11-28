import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { Home } from "./pages/Home";

const Root = (
  <>
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  </>
);

const mountNode = document.getElementById("app");
ReactDOM.render(Root, mountNode);
