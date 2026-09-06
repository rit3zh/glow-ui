import PieChart from "@/components/charts/pie-chart";
import type { IPieChartPoint } from "@/components/charts/pie-chart";
import AnimatedText from "@/components/organisms/animated-text";
import React, { useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Showcase } from "~/showcase";

const _width = Dimensions.get("window").width;

const PALETTE = ["#4DA3FF", "#1479FF", "#0A5FE0", "#0B49B8", "#0E3596"];

const SPEND: IPieChartPoint[] = [
  { label: "Housing", value: 1450 },
  { label: "Food", value: 620 },
  { label: "Transport", value: 340 },
  { label: "Health", value: 210 },
  { label: "Other", value: 180 },
];

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export default function PieChartScreen() {
  const [selected, setSelected] = useState<number>(-1);

  const total = useMemo(
    () => SPEND.reduce((sum, point) => sum + point.value, 0),
    [],
  );

  const point = selected >= 0 ? SPEND[selected] : undefined;

  return (
    <Showcase>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Spending</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>August</Text>
            </View>
          </View>

          <View style={styles.headline}>
            <AnimatedText
              text={formatMoney(point ? point.value : total)}
              style={styles.metric}
              animationConfig={{
                characterDelay: 14,
                characterEnterDuration: 300,
                characterExitDuration: 200,
                maxBlurIntensity: 24,
                spring: { damping: 15, stiffness: 210, mass: 1 },
              }}
            />
            <AnimatedText
              text={point ? point.label : "This month"}
              style={styles.caption}
              animationConfig={{
                characterDelay: 10,
                characterEnterDuration: 260,
                characterExitDuration: 180,
                maxBlurIntensity: 12,
                spring: { damping: 16, stiffness: 220, mass: 1 },
              }}
              enterFrom={{ opacity: 0, translateY: 12, scale: 0.8, rotate: 0 }}
              exitTo={{ opacity: 0, translateY: -10, scale: 0.9, rotate: 0 }}
            />
          </View>

          <PieChart.Root
            data={SPEND}
            style={styles.chart}
            innerRadius={0.66}
            padAngle={1.5}
            onSliceChange={(_, index) => setSelected(index)}
            onGestureEnd={() => setSelected(-1)}
          >
            <PieChart.Slices
              colors={PALETTE}
              inactiveOpacity={0.35}
              strokeColor="#141414"
            />
            <PieChart.Label
              placeholder="of budget"
              placeholderValue="82%"
              labelStyle={styles.labelText}
              valueStyle={styles.valueText}
            />
          </PieChart.Root>

          <View style={styles.rows}>
            {SPEND.map((point, index) => {
              const isActive = index === selected;
              return (
                <Pressable
                  key={point.label}
                  style={styles.row}
                  onPressIn={() => setSelected(index)}
                  onPressOut={() => setSelected(-1)}
                >
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: PALETTE[index % PALETTE.length] },
                      selected >= 0 && !isActive && styles.swatchDim,
                    ]}
                  />
                  <Text
                    numberOfLines={1}
                    style={[styles.rowLabel, isActive && styles.rowLabelActive]}
                  >
                    {point.label}
                  </Text>
                  <Text style={styles.rowShare}>
                    {Math.round((point.value / total) * 100)}%
                  </Text>
                  <Text
                    style={[styles.rowValue, isActive && styles.rowValueActive]}
                  >
                    {formatMoney(point.value)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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
    color: "#8A8A8E",
    fontSize: 14,
    fontWeight: "500",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#1E1E1E",
  },
  chipText: {
    color: "#8A8A8E",
    fontSize: 11,
    fontWeight: "600",
  },
  headline: {
    alignItems: "flex-start",
    marginTop: 10,
    gap: 2,
  },
  metric: {
    color: "#FAFAFA",
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  caption: {
    color: "#6E6E73",
    fontSize: 13,
  },
  chart: {
    height: 210,
    marginTop: 10,
  },
  labelText: {
    color: "#6E6E73",
    fontSize: 12,
  },
  valueText: {
    color: "#FAFAFA",
    fontSize: 20,
  },
  rows: {
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#242424",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#242424",
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  swatchDim: {
    opacity: 0.35,
  },
  rowLabel: {
    flex: 1,
    color: "#8A8A8E",
    fontSize: 14,
  },
  rowLabelActive: {
    color: "#FAFAFA",
  },
  rowShare: {
    color: "#5A5A5F",
    fontSize: 13,
    width: 38,
    textAlign: "right",
  },
  rowValue: {
    color: "#8A8A8E",
    fontSize: 14,
    fontWeight: "600",
    width: 72,
    textAlign: "right",
  },
  rowValueActive: {
    color: "#FAFAFA",
  },
});
