import React, { useState } from "react";
import { FaCog, FaSave } from "react-icons/fa";
import { VscChromeClose, VscDebugRestart } from "react-icons/vsc";
import { Box, Button, Stack, SystemCSSProperties } from "@chakra-ui/core";

import Slider from "./Slider";

export const DEFAULT_STATE = {
  strokeWeight: Number(localStorage.getItem("strokeWeight") || 2),
  symmetry: Number(localStorage.getItem("symmetry") || 12),
};

interface Props {
  onSymmetryChange(value: number): void;
  onStrokeWeightChange(value: number): void;
  onToggle(): void;
  onReset(): void;
  onSave(): void;
}

const styles: Record<string, SystemCSSProperties> = {
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,0.6)",
  },
  stack: {
    maxWidth: "400px",
    margin: "10vh auto",
    p: 3,
    color: "white",
    fontWeight: "500",
    fontSize: "1.25rem",
  },
  roundBtn: {
    borderRadius: "50%",
    height: 10,
    width: 10,
    padding: 0,
  },
};

const Controls: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);

  return (
    <Box
      sx={styles.wrapper}
      bottom={isOpen ? 0 : undefined}
      pt={isOpen ? 8 : undefined}
      onClick={(e) => {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(!isOpen);
          props.onToggle();
        }
      }}
    >
      {isOpen && (
        <Stack sx={styles.stack}>
          <Slider
            value={state.strokeWeight}
            label="Stroke Width"
            color="tomato"
            min={1}
            max={24}
            step={1}
            onChange={(strokeWeight) => {
              setState({ ...state, strokeWeight });
              props.onStrokeWeightChange(strokeWeight);
            }}
          />
          <Slider
            label="Symmetry"
            color="blue.500"
            value={state.symmetry}
            min={2}
            step={2}
            max={48}
            onChange={(symmetry) => {
              setState({ ...state, symmetry });
              props.onSymmetryChange(symmetry);
            }}
          />
        </Stack>
      )}
      <Box position="absolute" right={2} top={2}>
        <Stack isInline spacing={2}>
          <Button sx={styles.roundBtn} color="green" onClick={props.onSave}>
            <FaSave fontSize="1.2rem" />
          </Button>
          <Button sx={styles.roundBtn} color="blue" onClick={props.onReset}>
            <VscDebugRestart fontSize="1.25rem" />
          </Button>
          <Button
            sx={styles.roundBtn}
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

export default Controls;
