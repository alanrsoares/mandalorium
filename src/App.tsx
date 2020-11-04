import React, { Component } from "react";
import Sketch from "react-p5";
import IP5 from "p5";

import { getRainbowHSL } from "./lib/colors";
import Controls, { DEFAULT_STATE } from "./components/Controls";

import "./styles.css";
import { FaWizardsOfTheCoast } from "react-icons/fa";
import { Flex } from "@chakra-ui/core";

interface State {
  mode: "locked" | "drawing" | "recording" | "playing";
}

interface Segment {
  deltas: Pick<IP5, "mouseX" | "mouseY" | "pmouseX" | "pmouseY">;
  strokeWeight: number;
  angle: number;
  symmetry: number;
  color: string;
}

export default class App extends Component<{}, State> {
  symmetry = DEFAULT_STATE.symmetry;
  strokeWeight = DEFAULT_STATE.strokeWeight;

  colorRange = 0;
  p5: IP5 | undefined = undefined;
  segments: Segment[] = [];

  state: State = {
    mode: "drawing",
  };

  get angle() {
    return 360 / this.symmetry;
  }

  setup = (p5: IP5, parentRef: Element) => {
    this.p5 = p5;

    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(parentRef);
    p5.angleMode(p5.DEGREES);
    p5.background(0);
    p5.colorMode(p5.HSL);
    p5.smooth();
    p5.cursor("crosshair");

    this.colorRange = (p5.width * p5.height) / (p5.width + p5.height);
  };

  drawSegment = (segment: Segment, p5: IP5) => {
    const { deltas } = segment;

    for (let i = 0; i < segment.symmetry; i++) {
      p5.rotate(segment.angle);
      p5.stroke(segment.color);
      p5.strokeWeight(segment.strokeWeight);
      p5.line(deltas.mouseX, deltas.mouseY, deltas.pmouseX, deltas.pmouseY);
      p5.push();
      p5.scale(1, -1);
      p5.line(deltas.mouseX, deltas.mouseY, deltas.pmouseX, deltas.pmouseY);
      p5.pop();
    }
  };

  draw = (p5: IP5) => {
    if (this.state.mode === "locked") return;

    const { width, height, mouseX, mouseY, pmouseX, pmouseY } = p5;

    const center = { x: width / 2, y: height / 2 };

    p5.translate(center.x, center.y);

    const isInCanvasBounds =
      mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

    if (isInCanvasBounds) {
      const deltas = {
        // distance from current mouse position to canvas's center
        mouseX: mouseX - center.x,
        mouseY: mouseY - center.y,
        // distance from previous mouse position to canvas's center
        pmouseX: pmouseX - center.x,
        pmouseY: pmouseY - center.y,
      };

      if (p5.mouseIsPressed) {
        const segment: Segment = {
          deltas,
          strokeWeight: this.strokeWeight,
          angle: this.angle,
          symmetry: this.symmetry,
          color: getRainbowHSL(mouseY, mouseX, this.colorRange * 2),
        };

        if (this.state.mode === "recording") {
          this.segments.push(segment);
        }

        this.drawSegment(segment, p5);
      }
    }
  };

  frame = (segments: Segment[], p5: IP5) => {
    if (segments.length) {
      if (this.state.mode === "playing") {
        const [hd, ...tl] = segments;
        this.drawSegment(hd, p5);

        setTimeout(() => {
          this.frame(tl, p5);
        }, 16);
      }
    } else {
      this.setState({ mode: "drawing" });
    }
  };

  playRecording = () => {
    if (!this.p5) {
      return;
    }

    this.frame(this.segments, this.p5);

    this.p5.background(0);
  };

  render() {
    return (
      <>
        <Controls
          mode={this.state.mode}
          onStrokeWeightChange={(x) => {
            localStorage.setItem("strokeWeight", String(x));
            this.strokeWeight = x;
          }}
          onSymmetryChange={(x) => {
            localStorage.setItem("symmetry", String(x));
            this.symmetry = x;
          }}
          onToggleControls={() => {
            if (this.state.mode !== "locked") {
              this.setState({ mode: "locked" });
            }
          }}
          onToggleRecordMode={() => {
            switch (this.state.mode) {
              case "recording":
                this.setState({ mode: "drawing" });
                break;
              case "playing":
                return;
              default:
                this.setState({ mode: "recording" });
            }
          }}
          onTogglePlayMode={() => {
            switch (this.state.mode) {
              case "playing":
                this.setState({ mode: "drawing" });
                break;
              case "recording":
                return;
              default:
                this.setState({ mode: "playing" }, this.playRecording);
            }
          }}
          onReset={() => {
            this.p5?.background(0);
          }}
          onSave={() => {
            this.p5?.saveCanvas("kaleidoscopic-wunderbar", "png");
          }}
        />
        <Flex justify="center" align="center" bg="black">
          <Sketch setup={this.setup} draw={this.draw} />
        </Flex>
      </>
    );
  }
}
