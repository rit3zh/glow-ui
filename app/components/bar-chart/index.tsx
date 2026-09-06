import BarChart from "@/components/charts/bar-chart";
import type { IBarChartPoint } from "@/components/charts/bar-chart";
import { StaggeredText } from "@/components/organisms/animated-text";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Showcase } from "~/showcase";

const _width = Dimensions.get("window").width;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SCREEN_TIME = [3.2, 4.6, 2.8, 5.1, 6.4, 7.9, 5.5];

const ACCENT = "#0A84FF";
const ACCENT_ACTIVE = "#5AC8FA";

function formatHours(value: number) {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${hours}h ${minutes}m`;
}

export default function BarChartScreen() {
  const [selected, setSelected] = useState<IBarChartPoint | null>(null);

  const data = useMemo<IBarChartPoint[]>(
    () => DAYS.map((label, i) => ({ label, value: SCREEN_TIME[i]! })),
    [],
  );

  const average = useMemo(
    () => SCREEN_TIME.reduce((a, b) => a + b, 0) / SCREEN_TIME.length,
    [],
  );

  return (
    <Showcase>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Screen Time</Text>

          <StaggeredText
            style={styles.metric}
            animationConfig={{
              characterDelay: 10,
              characterEnterDuration: 260,
              characterExitDuration: 180,
              maxBlurIntensity: 12,
              spring: { damping: 16, stiffness: 220, mass: 1 },
            }}
            enterFrom={{ opacity: 0, translateY: 18, scale: 0.8, rotate: 0 }}
            exitTo={{ opacity: 0, translateY: -10, scale: 0.9, rotate: 0 }}
            text={formatHours(selected ? selected.value : average)}
          />

          <Text style={styles.caption}>
            {selected ? selected.label : "Daily average"}
          </Text>

          <BarChart.Root
            data={data}
            style={styles.chart}
            onBarChange={setSelected}
            onGestureEnd={() => setSelected(null)}
          >
            <BarChart.Tooltip />
            <BarChart.Bars color={ACCENT} activeColor={ACCENT_ACTIVE} />
            <BarChart.XAxis
              style={styles.axisLabel}
              activeStyle={styles.axisLabelActive}
            />
          </BarChart.Root>
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
  title: {
    color: "#8A8A8E",
    fontSize: 14,
    fontWeight: "500",
  },
  metric: {
    color: "#FAFAFA",
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: -0.5,
    marginTop: 6,
  },
  caption: {
    color: "#6E6E73",
    fontSize: 13,
    marginTop: 2,
  },
  chart: {
    height: 160,
    marginTop: 20,
    right: 20,
  },
  axisLabel: {
    color: "#6E6E73",
    fontSize: 11,
  },
  axisLabelActive: {
    color: "#FAFAFA",
  },
});
