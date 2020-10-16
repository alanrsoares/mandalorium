import React, { Component, useState } from "react";
import { render } from "react-dom";
import {
  Box,
  Button,
  CSSReset,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  ChakraProvider,
} from "@chakra-ui/core";
import Sketch from "react-p5";
import IP5 from "p5";
import { FaCog, FaSave } from "react-icons/fa";
import { VscChromeClose, VscDebugRestart } from "react-icons/vsc";
import { MdGraphicEq } from "react-icons/md";

import { getRainbowHSL } from "./colors";
import "./styles.css";

const DEFAULT_STATE = {
  strokeWidth: Number(localStorage.getItem("strokeWidth") || 2),
  symmetry: Number(localStorage.getItem("symmetry") || 12),
};

const Controls: React.FC<{
  onSymmetryChange(value: number): void;
  onStrokeWidthChange(value: number): void;
  onToggle(): void;
  onReset(): void;
  onSave(): void;
}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);

  return (
    <Box
      position="absolute"
      top={0}
      bottom={isOpen ? 0 : undefined}
      left={0}
      right={0}
      pt={isOpen ? 8 : undefined}
      background="rgba(0,0,0,0.6)"
      onClick={(e) => {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(!isOpen);
          props.onToggle();
        }
      }}
    >
      {isOpen && (
        <Stack
          maxWidth="400px"
          margin="10vh auto"
          p={3}
          color="white"
          fontWeight="500"
          fontSize="1.25rem"
        >
          <Box as="label">
            Stroke Width ({state.strokeWidth})
            <Slider
              // @ts-ignore
              defaultValue={state.strokeWidth}
              min={1}
              max={24}
              step={1}
              onChange={(strokeWidth) => {
                setState({ ...state, strokeWidth });
                props.onStrokeWidthChange(strokeWidth);
              }}
              width="100%"
            >
              <SliderTrack bg="red.100" />
              <SliderFilledTrack bg="tomato" />
              <SliderThumb boxSize={6}>
                <Box color="tomato" as={MdGraphicEq} />
              </SliderThumb>
            </Slider>
          </Box>
          <Box as="label">
            Symmetry ({state.symmetry})
            <Slider
              // @ts-ignore
              defaultValue={state.symmetry}
              min={2}
              step={2}
              max={48}
              onChange={(symmetry) => {
                setState({ ...state, symmetry });
                props.onSymmetryChange(symmetry);
              }}
              color="blue"
              width="100%"
            >
              <SliderTrack />
              <SliderFilledTrack />
              <SliderThumb boxSize={6}>
                <Box color="blue.500" as={MdGraphicEq} />
              </SliderThumb>
            </Slider>
          </Box>
        </Stack>
      )}
      <Box position="absolute" right={2} top={2}>
        <Stack isInline spacing={2}>
          <Button
            borderRadius="50%"
            height={10}
            width={10}
            padding={0}
            color="green"
            onClick={props.onSave}
          >
            <FaSave fontSize="1.2rem" />
          </Button>
          <Button
            borderRadius="50%"
            height={10}
            width={10}
            padding={0}
            color="blue"
            onClick={props.onReset}
          >
            <VscDebugRestart fontSize="1.25rem" />
          </Button>
          <Button
            borderRadius="50%"
            height={10}
            width={10}
            padding={0}
            size="sm"
            aria-label="toggle controls"
            onClick={() => {
              props.onToggle();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <VscChromeClose fontSize="1.25rem" />
            ) : (
              <FaCog fontSize="1.25rem" />
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

class App extends Component {
  symmetry = DEFAULT_STATE.symmetry;
  strokeWidth = DEFAULT_STATE.strokeWidth;

  colorRange = 0;
  drawingLocked = false;
  p5?: IP5 = undefined;

  get angle() {
    return 360 / this.symmetry;
  }

  setup = (p5: IP5) => {
    this.p5 = p5;
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.angleMode(p5.DEGREES);
    p5.background(0);
    p5.colorMode(p5.HSL);

    this.colorRange = (p5.width * p5.height) / (p5.width + p5.height);
  };

  draw = (p5: IP5) => {
    if (this.drawingLocked) return;

    const { width, height, mouseX, mouseY, pmouseX, pmouseY } = p5;

    p5.translate(width / 2, height / 2);

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      const mx = mouseX - width / 2;
      const my = mouseY - height / 2;
      const pmx = pmouseX - width / 2;
      const pmy = pmouseY - height / 2;

      if (p5.mouseIsPressed) {
        const color = getRainbowHSL(mouseY, mouseX, this.colorRange * 2);

        for (let i = 0; i < this.symmetry; i++) {
          p5.rotate(this.angle);
          p5.stroke(color);
          p5.strokeWeight(this.strokeWidth);
          p5.line(mx, my, pmx, pmy);
          p5.push();
          p5.scale(1, -1);
          p5.line(mx, my, pmx, pmy);
          p5.pop();
        }
      }
    }
  };

  render() {
    return (
      <>
        <Controls
          onStrokeWidthChange={(x) => {
            localStorage.setItem("strokeWidth", String(x));
            this.strokeWidth = x;
          }}
          onSymmetryChange={(x) => {
            localStorage.setItem("symmetry", String(x));
            this.symmetry = x;
          }}
          onToggle={() => {
            this.drawingLocked = !this.drawingLocked;
          }}
          onReset={() => {
            this.p5?.background(0);
          }}
          onSave={() => {
            this.p5?.saveCanvas("kaleidoscopic-wunderbar", "png");
          }}
        />
        <Sketch setup={this.setup} draw={this.draw} />
      </>
    );
  }
}

const rootElement = document.getElementById("root");

render(
  <ChakraProvider>
    <CSSReset />
    <App />
  </ChakraProvider>,
  rootElement
);
