import RadialChart from "@/components/charts/radial-chart";
import type { IRadialChartPoint } from "@/components/charts/radial-chart";
import AnimatedText from "@/components/organisms/animated-text";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Showcase } from "~/showcase";
const define = (asyncUse: boolean) => {};
const _width = Dimensions.get("window").width;

const PALETTE = ["#7C8394", "#8F7BE8", "#E0A343", "#3FBF93"];

const RINGS: IRadialChartPoint[] = [
  { label: "Sleep", value: 6.4, max: 8 },
  { label: "Steps", value: 8200, max: 10000 },
  { label: "Move", value: 520, max: 600 },
  { label: "Exercise", value: 34, max: 45 },
];

const UNITS = ["h", "", "kcal", "min"];

function formatGoal(point: IRadialChartPoint, index: number) {
  const unit = UNITS[index];
  const value = point.value.toLocaleString("en-US");
  return unit ? `${value} ${unit}` : value;
}

function share(point: IRadialChartPoint) {
  return Math.round((point.value / (point.max ?? 1)) * 100);
}

export default function RadialChartScreen() {
  const [selected, setSelected] = useState<number>(-1);

  const point = selected >= 0 ? RINGS[selected] : undefined;
  const insets = useSafeAreaInsets();
  return (
    <Showcase>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headline}>
          <AnimatedText
            text={point ? `${share(point)}%` : "84%"}
            style={styles.metric}
            animationConfig={{
              characterDelay: 14,
              characterEnterDuration: 300,
              characterExitDuration: 200,
              maxBlurIntensity: 20,
              spring: { damping: 15, stiffness: 210, mass: 1 },
            }}
          />
          <AnimatedText
            text={point ? point.label : "of every goal"}
            style={styles.caption}
            animationConfig={{
              characterDelay: 10,
              characterEnterDuration: 260,
              characterExitDuration: 180,
              maxBlurIntensity: 10,
              spring: { damping: 16, stiffness: 220, mass: 1 },
            }}
            enterFrom={{ opacity: 0, translateY: 10, scale: 0.9, rotate: 0 }}
            exitTo={{ opacity: 0, translateY: -8, scale: 0.94, rotate: 0 }}
          />
        </View>

        <RadialChart.Root
          data={RINGS}
          variant="circle"
          style={styles.chart}
          onRingChange={(_, index) => setSelected(index)}
          onGestureEnd={() => setSelected(-1)}
        >
          <RadialChart.Tracks color="#1A1A1C" />
          <RadialChart.Bars colors={PALETTE} inactiveOpacity={0.22} />
        </RadialChart.Root>

        <View style={styles.rows}>
          {RINGS.map((ring, index) => {
            const isActive = index === selected;
            return (
              <Pressable
                key={ring.label}
                style={styles.row}
                onPressIn={() => setSelected(index)}
                onPressOut={() => setSelected(-1)}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: PALETTE[index % PALETTE.length] },
                    selected >= 0 && !isActive && styles.dotDim,
                  ]}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.rowLabel, isActive && styles.rowLabelActive]}
                >
                  {ring.label}
                </Text>
                <Text
                  style={[styles.rowValue, isActive && styles.rowValueActive]}
                >
                  {formatGoal(ring, index)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.rule} />

        <Text style={styles.eyebrow}>This week</Text>

        <RadialChart.Root
          data={RINGS}
          variant="semicircle"
          style={styles.gauge}
          bottomInset={84}
        >
          <RadialChart.Tracks color="#1A1A1C" />
          <RadialChart.Bars
            colors={PALETTE}
            inactiveOpacity={0.22}
            activeColor="#F5F5F7"
          />
          <RadialChart.Label
            placeholder="on track"
            placeholderValue="84%"
            labelStyle={styles.labelText}
            valueStyle={styles.valueText}
          />
          <RadialChart.Legend
            colors={PALETTE}
            style={styles.legend}
            itemStyle={styles.legendItem}
            labelStyle={styles.legendLabel}
            activeLabelStyle={styles.legendLabelActive}
            valueStyle={styles.legendValue}
          />
        </RadialChart.Root>
      </ScrollView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#08080A",
  },
  content: {
    width: _width,
    paddingHorizontal: 28,

    paddingBottom: 56,
  },
  eyebrow: {
    color: "#4E4E55",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  headline: {
    marginTop: 14,
    gap: 2,
  },
  metric: {
    color: "#F5F5F7",
    fontSize: 40,
    fontWeight: "600",
    letterSpacing: -1.2,
  },
  caption: {
    color: "#6E6E76",
    fontSize: 13,
  },
  chart: {
    height: 236,
    marginTop: 22,
  },
  gauge: {
    height: 250,
    marginTop: 20,
  },
  rows: {
    marginTop: 26,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#18181B",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  dotDim: {
    opacity: 0.28,
  },
  rowLabel: {
    flex: 1,
    color: "#7C7C85",
    fontSize: 14,
  },
  rowLabelActive: {
    color: "#F5F5F7",
  },
  rowValue: {
    color: "#7C7C85",
    fontSize: 14,
    letterSpacing: -0.2,
  },
  rowValueActive: {
    color: "#F5F5F7",
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#18181B",
    marginVertical: 44,
  },
  labelText: {
    color: "#6E6E76",
    fontSize: 12,
  },
  valueText: {
    color: "#F5F5F7",
    fontSize: 26,
  },
  legend: {
    paddingHorizontal: 2,
    rowGap: 2,
  },
  legendItem: {
    paddingVertical: 3,
  },
  legendLabel: {
    color: "#7C7C85",
    fontSize: 12,
  },
  legendLabelActive: {
    color: "#F5F5F7",
  },
  legendValue: {
    color: "#5A5A62",
    fontSize: 12,
  },
});
