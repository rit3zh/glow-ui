import { createContext, useContext } from "react";
import type { StepperContextProps } from "./types";

export const StepperContext = createContext<StepperContextProps | undefined>(
  undefined
);

export const useStepperContext = () => {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error(
      "Stepper components must be used within a Stepper component"
    );
  }

  return context;
};
