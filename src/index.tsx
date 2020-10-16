import React, { Component, useState } from "react";
import { render } from "react-dom";
import {
  Box,
  Button,
  CSSReset,
  Input,
  Stack,
  ThemeProvider,
  useDisclosure
} from "@chakra-ui/core";
import Sketch from "react-p5";
import IP5 from "p5";
import { FaCog } from "react-icons/fa";

import { getRainbowHSL } from "./colors";
import "./styles.css";

const DEFAULT_STATE = {
  strokeWidth: Number(localStorage.getItem("strokeWidth") ?? 2),
  symmetry: Number(localStorage.getItem("symmetry") ?? 12)
};

const Controls: React.FC<{
  onSymmetryChange(value: number): void;
  onStrokeWidthChange(value: number): void;
  onToggle(): void;
  onReset(): void;
  onSave(): void;
}> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const [state, setState] = useState(DEFAULT_STATE);

  return (
    <Box
      position="absolute"
      top={0}
      bottom={isOpen ? 0 : undefined}
      left={0}
      right={0}
      pt={isOpen ? 4 : undefined}
      background="rgba(0,0,0,0.6)"
      onClick={() => {
        if (isOpen) {
          onToggle();
          props.onToggle();
        }
      }}
    >
      {isOpen && (
        <Stack p={3} color="white" fontWeight="500" fontSize="1.25rem">
          <Box as="label">
            Stroke Width ({state.strokeWidth})
            <Input
              type="range"
              min={1}
              max={24}
              step={1}
              defaultValue={String(state.strokeWidth)}
              onChange={(x) => {
                const strokeWidth = Number(x.target.value);
                setState({ ...state, strokeWidth });
                props.onStrokeWidthChange(strokeWidth);
              }}
            />
          </Box>
          <Box as="label">
            Symmetry ({state.symmetry})
            <Input
              type="range"
              min={2}
              step={2}
              max={48}
              defaultValue={String(state.symmetry)}
              onChange={(x) => {
                const symmetry = Number(x.target.value);
                setState({ ...state, symmetry });
                props.onSymmetryChange(symmetry);
              }}
            />
          </Box>
          <Stack isInline spacing={2}>
            <Button variantColor="green" onClick={props.onSave}>
              Save
            </Button>
            <Button variantColor="blue" onClick={props.onReset}>
              Start over
            </Button>
          </Stack>
        </Stack>
      )}
      <Button
        borderRadius="50%"
        position="absolute"
        height={10}
        width={10}
        padding={0}
        size="sm"
        right={2}
        top={2}
        aria-label="toggle controls"
        onClick={(e) => {
          e.preventDefault();
          props.onToggle();
          onToggle();
        }}
      >
        <FaCog fontSize="1.5rem" />
      </Button>
    </Box>
  );
};

class App extends Component {
  symmetry = DEFAULT_STATE.symmetry;
  strokeWidth = DEFAULT_STATE.strokeWidth;

  colorRange = 0;
  drawingLocked = false;
  p5: IP5 = undefined;

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
  <ThemeProvider>
    <CSSReset />
    <App />
  </ThemeProvider>,
  rootElement
);
