import { createContext, useContext } from "react";

import type { IPieChartContext } from "./types";

const PieChartContext = createContext<IPieChartContext | null>(null);

const usePieChart = (part: string): IPieChartContext => {
  const context = useContext(PieChartContext);
  if (!context) {
    throw new Error(
      `PieChart.${part} must be rendered inside <PieChart.Root>.`,
    );
  }
  return context;
};

export { PieChartContext, usePieChart };
