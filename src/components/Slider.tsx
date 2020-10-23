import React from "react";
import {
  Box,
  ResponsiveValue,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Slider as ChakraSlider,
} from "@chakra-ui/core";
import { MdGraphicEq } from "react-icons/md";
import CSS from "csstype";

interface Props {
  label: string;
  onChange: (value: number) => void;
  color: ResponsiveValue<CSS.Property.Color>;
  value: number;
  min: number;
  max: number;
  step: number;
}

const Slider: React.FC<Props> = (props) => {
  return (
    <Box as="label">
      {props.label} ({props.value})
      <ChakraSlider
        defaultValue={props.value}
        min={props.min}
        step={props.step}
        max={props.max}
        onChange={props.onChange}
        color="blue"
        width="100%"
      >
        <SliderTrack />
        <SliderFilledTrack />
        <SliderThumb boxSize={6}>
          <Box color={props.color} as={MdGraphicEq} />
        </SliderThumb>
      </ChakraSlider>
    </Box>
  );
};

export default Slider;
