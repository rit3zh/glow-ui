import { createContext, useContext } from "react";

import type { ILineChartContext } from "./types";

const LineChartContext = createContext<ILineChartContext | null>(null);

const useLineChart = (part: string): ILineChartContext => {
  const context = useContext(LineChartContext);
  if (!context) {
    throw new Error(
      `LineChart.${part} must be rendered inside <LineChart.Root>.`,
    );
  }
  return context;
};

export { LineChartContext, useLineChart };
