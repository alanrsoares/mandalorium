import { Box, Flex, Heading } from "@chakra-ui/core";
import React, { Component } from "react";

interface Props {}

interface State {
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error) {
    if (error && error.message) {
      return { error };
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Flex
          height="100vh"
          bg="black"
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            justifyContent="center"
            w="20rem"
            bg="gray.700"
            p={4}
            borderRadius=".75rem"
          >
            <Box color="white">
              <Heading as="h1" size="l" textAlign="center">
                Something went wrong!
              </Heading>
              <Box pt="1rem">
                The error says:{" "}
                <Box as="code">"{this.state.error.message}"</Box>
              </Box>
            </Box>
          </Flex>
        </Flex>
      );
    }

    return this.props.children;
  }
}
