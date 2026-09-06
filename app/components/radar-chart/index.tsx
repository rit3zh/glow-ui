import { Tabs } from "@/components";
import RadarChart from "@/components/charts/radar-chart";
import type { IRadarChartSeries } from "@/components/charts/radar-chart";
import AnimatedText from "@/components/organisms/animated-text";
import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Showcase } from "~/showcase";

const _width = Dimensions.get("window").width;

const AXES = ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "Python"];

const DESKTOP = "#3B82F6";
const MOBILE = "#22C55E";

const PERIODS = ["2023", "2024", "2025"] as const;

type TPeriod = (typeof PERIODS)[number];

const DATA: Record<TPeriod, IRadarChartSeries[]> = {
  "2023": [
    { name: "Desktop", color: DESKTOP, values: [190, 90, 150, 0, 160, 40] },
    { name: "Mobile", color: MOBILE, values: [60, 70, 80, 140, 90, 10] },
  ],
  "2024": [
    { name: "Desktop", color: DESKTOP, values: [186, 205, 237, 173, 209, 214] },
    { name: "Mobile", color: MOBILE, values: [80, 200, 120, 190, 130, 140] },
  ],
  "2025": [
    { name: "Desktop", color: DESKTOP, values: [240, 290, 200, 150, 180, 260] },
    { name: "Mobile", color: MOBILE, values: [190, 250, 210, 230, 150, 220] },
  ],
};

export default function RadarChartScreen() {
  const [period, setPeriod] = useState<TPeriod>("2024");
  const [axis, setAxis] = useState<string | null>(null);

  const handlePeriodChange = useCallback((value: string) => {
    if (PERIODS.includes(value as TPeriod)) setPeriod(value as TPeriod);
  }, []);

  return (
    <Showcase>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Skill coverage</Text>
            <Tabs.Root value={period} onValueChange={handlePeriodChange}>
              <Tabs.List size="default" style={styles.segmented}>
                {PERIODS.map((option) => (
                  <Tabs.Trigger
                    key={option}
                    value={option}
                    style={styles.segment}
                    labelStyle={styles.segmentLabel}
                  >
                    {option}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </View>

          <AnimatedText
            text={axis ?? "Desktop vs Mobile"}
            style={styles.caption}
            animationConfig={{
              characterDelay: 8,
              characterEnterDuration: 260,
              characterExitDuration: 180,
              maxBlurIntensity: 12,
              spring: { damping: 16, stiffness: 220, mass: 1 },
            }}
            enterFrom={{ opacity: 0, translateY: 10, scale: 0.85, rotate: 0 }}
            exitTo={{ opacity: 0, translateY: -8, scale: 0.9, rotate: 0 }}
          />

          <RadarChart.Root
            data={DATA[period]}
            axes={AXES}
            style={styles.chart}
            labelInset={30}
            onAxisChange={setAxis}
            onGestureEnd={() => setAxis(null)}
          >
            <RadarChart.Grid color="rgba(255,255,255,0.10)" />
            <RadarChart.Axes color="rgba(255,255,255,0.10)" />
            <RadarChart.Shapes
              fillOpacity={0.16}
              dotFillColor="#141414"
              activeDotRadius={0}
            />
            <RadarChart.Labels
              style={styles.axisLabel}
              activeStyle={styles.axisLabelActive}
            />
          </RadarChart.Root>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 24,
    width: _width - 40,
    padding: 22,
    backgroundColor: "#141414",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FAFAFA",
    fontSize: 16,
    fontWeight: "600",
  },
  segmented: {
    borderRadius: 999,
  },
  segment: {
    paddingHorizontal: 12,
    height: 28,
  },
  segmentLabel: {
    fontSize: 13,
  },
  caption: {
    color: "#6E6E73",
    fontSize: 13,
    marginTop: 6,
  },
  chart: {
    height: 300,
    marginTop: 4,
  },
  axisLabel: {
    color: "#6E6E73",
    fontSize: 12,
  },
  axisLabelActive: {
    color: "#FAFAFA",
  },
  tooltip: {
    backgroundColor: "#1E1E1E",
  },
  tooltipLabel: {
    color: "#FAFAFA",
  },
  tooltipName: {
    color: "#8A8A8E",
  },
  tooltipValue: {
    color: "#FAFAFA",
  },
});
