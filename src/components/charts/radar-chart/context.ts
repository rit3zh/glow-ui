import { createContext, useContext } from "react";

import type { IRadarChartContext } from "./types";

const RadarChartContext = createContext<IRadarChartContext | null>(null);

const useRadarChart = (part: string): IRadarChartContext => {
  const context = useContext(RadarChartContext);
  if (!context) {
    throw new Error(
      `RadarChart.${part} must be rendered inside <RadarChart.Root>.`,
    );
  }
  return context;
};

export { RadarChartContext, useRadarChart };
