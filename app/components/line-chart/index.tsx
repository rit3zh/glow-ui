import LineChart from "@/components/charts/line-chart";
import type { ILineChartPoint } from "@/components/charts/line-chart";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Showcase } from "~/showcase";
import { StaggeredText } from "@components/organisms/animated-text";
const RANGES = ["1W", "1M", "1D", "1Y"] as const;

type Range = (typeof RANGES)[number];

const SERIES: Record<Range, number[]> = {
  "1W": [128, 131, 126, 138, 142, 136, 149],
  "1D": [258, 275, 416, 938],
  "1M": [96, 104, 99, 118, 112, 127, 121, 134, 130, 146, 141, 158],
  "1Y": [42, 58, 51, 74, 69, 88, 96, 84, 103, 118, 112, 137, 129, 152, 168],
};

export default function LineChartScreen() {
  const [range, setRange] = useState<Range>("1M");
  const [selected, setSelected] = useState<ILineChartPoint | null>(null);

  const data = useMemo<ILineChartPoint[]>(
    () => SERIES[range].map((y, x) => ({ x, y })),
    [range],
  );

  const onPointChange = useCallback((point: ILineChartPoint) => {
    setSelected(point);
  }, []);

  const onGestureEnd = useCallback(() => setSelected(null), []);

  const latest = data[data.length - 1]!;
  const shown = selected ?? latest;

  return (
    <Showcase>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Portfolio</Text>

          <StaggeredText
            text={shown.y.toFixed(2)}
            style={styles.value}
            animationConfig={{
              spring: {
                damping: 15,
                stiffness: 210,
                mass: 1,
              },
              characterDelay: 20,
              maxBlurIntensity: 32,
            }}
            enterFrom={{
              opacity: 0,
              translateY: 25,
              scale: 0.2,
              rotate: 0,
            }}
            exitFrom={{
              opacity: 1,
              translateY: 0,
              scale: 1,
              rotate: 0,
            }}
          />

          <LineChart.Root
            data={data}
            curve="natural"
            style={styles.chart}
            onPointChange={onPointChange}
            drawDuration={2000}
            onGestureEnd={onGestureEnd}
          >
            <LineChart.Grid count={4} />
            <LineChart.Line thickness={3} />
            <LineChart.Indicator />
            <LineChart.Cursor />
            <LineChart.Tooltip format={(point) => `$${point.y.toFixed(2)}`} />
          </LineChart.Root>

          <View style={styles.ranges}>
            {RANGES.map((item) => (
              <Pressable
                key={item}
                onPress={() => setRange(item)}
                style={[styles.range, range === item && styles.rangeActive]}
              >
                <Text
                  style={[
                    styles.rangeText,
                    range === item && styles.rangeTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#0B0B0C",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.08)",
  },
  label: {
    color: "#71717A",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.4,
  },
  value: {
    color: "#FAFAFA",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 2,
  },
  chart: {
    height: 200,
    marginTop: 16,
  },
  ranges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  range: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  rangeActive: {
    backgroundColor: "rgba(74,222,128,0.16)",
  },
  rangeText: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "600",
  },
  rangeTextActive: {
    color: "#4ADE80",
  },
});
