import React from "react";

import { Box, Flex } from "@chakra-ui/core";

import { ReactComponent as Chakra1 } from "assets/chakra_1.svg";
import { ReactComponent as Chakra2 } from "assets/chakra_2.svg";
import { ReactComponent as Chakra3 } from "assets/chakra_3.svg";

const styles = {
  icon: {
    height: "8rem",
    width: "8rem",
    opacity: 0,
    m: ".5rem",
  },
};

const Splash: React.FC = () => {
  return (
    <Flex height="100vh" justify="center" align="center" bg="black">
      <Box
        animation="fadeIn 2s ease-in-out .5s 1"
        as={Chakra1}
        color="palevioletred"
        sx={styles.icon}
      />
      <Box
        animation="fadeIn 2s ease-in-out 1s 1"
        as={Chakra2}
        color="tomato"
        sx={styles.icon}
      />
      <Box
        animation="fadeIn 2s ease-in-out 1.5s 1"
        as={Chakra3}
        sx={styles.icon}
      />
    </Flex>
  );
};
export default Splash;
