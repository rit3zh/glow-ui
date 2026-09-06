import { createContext, useContext } from "react";

import type { IBarChartContext } from "./types";

const BarChartContext = createContext<IBarChartContext | null>(null);

const useBarChart = (part: string): IBarChartContext => {
  const context = useContext(BarChartContext);
  if (!context) {
    throw new Error(
      `BarChart.${part} must be rendered inside <BarChart.Root>.`,
    );
  }
  return context;
};

export { BarChartContext, useBarChart };
