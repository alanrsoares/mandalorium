import React, { Component } from "react";
import Sketch from "react-p5";
import IP5 from "p5";

import { getRainbowHSL } from "./lib/colors";
import Controls, { DEFAULT_STATE } from "./components/Controls";

import "./styles.css";

export default class App extends Component {
  symmetry = DEFAULT_STATE.symmetry;
  strokeWeight = DEFAULT_STATE.strokeWeight;

  colorRange = 0;
  drawingLocked = false;
  p5: IP5 | undefined = undefined;

  get angle() {
    return 360 / this.symmetry;
  }

  setup = (p5: IP5) => {
    this.p5 = p5;
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.angleMode(p5.DEGREES);
    p5.background(0);
    p5.colorMode(p5.HSL);
    p5.smooth();

    this.colorRange = (p5.width * p5.height) / (p5.width + p5.height);
  };

  draw = (p5: IP5) => {
    if (this.drawingLocked) return;

    const { width, height, mouseX, mouseY, pmouseX, pmouseY } = p5;

    const center = { x: width / 2, y: height / 2 };

    p5.translate(center.x, center.y);

    const isInCanvasBounds =
      mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

    if (isInCanvasBounds) {
      // distance from current mouse position to canvas's center
      const mx = mouseX - center.x;
      const my = mouseY - center.y;
      // distance from previous mouse position to canvas's center
      const pmx = pmouseX - center.x;
      const pmy = pmouseY - center.y;

      if (p5.mouseIsPressed) {
        const color = getRainbowHSL(mouseY, mouseX, this.colorRange * 2);

        for (let i = 0; i < this.symmetry; i++) {
          p5.rotate(this.angle);
          p5.stroke(color);
          p5.strokeWeight(this.strokeWeight);
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
          onStrokeWeightChange={(x) => {
            localStorage.setItem("strokeWeight", String(x));
            this.strokeWeight = x;
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
