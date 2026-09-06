import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SplitViewRoot,
  SplitViewBottom,
  SplitViewHandle,
  SplitViewTop,
} from "@/components/molecules/split-view";
import { Showcase } from "~/showcase";

const TINT = "#f2f2f5";
const MUTED = "rgba(242,242,245,0.4)";

const WEEK = [
  { day: "M", value: 0.42 },
  { day: "T", value: 0.68 },
  { day: "W", value: 0.35 },
  { day: "T", value: 0.86 },
  { day: "F", value: 0.54 },
  { day: "S", value: 1 },
  { day: "S", value: 0.24 },
];

export default function SplitViewScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            paddingTop: insets.top + 92,
            paddingBottom: insets.bottom + 92,
          },
        ]}
      >
        <SplitViewRoot
          style={styles.root}
          gap={25}
          initialTopHeight={280}
          minTopHeight={120}
          minBottomHeight={150}
        >
          <SplitViewTop style={styles.pane}>
            <Text style={styles.value}>8,412</Text>
            <Text style={styles.caption}>steps today</Text>
          </SplitViewTop>

          <SplitViewHandle />

          <SplitViewBottom style={styles.pane}>
            <View style={styles.chart}>
              {WEEK.map((item, index) => (
                <View key={index} style={styles.column}>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${item.value * 100}%` },
                        item.value === 1 && styles.barPeak,
                      ]}
                    />
                  </View>
                  <Text style={styles.day}>{item.day}</Text>
                </View>
              ))}
            </View>
          </SplitViewBottom>
        </SplitViewRoot>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    paddingHorizontal: 12,
  },
  root: {
    flex: 1,
    borderRadius: 34,
    padding: 8,
    overflow: "hidden",
    backgroundColor: "#121212",
  },
  pane: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#1a1a1a",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  value: { color: TINT, fontSize: 56, fontWeight: "600", letterSpacing: -2 },
  caption: { color: MUTED, fontSize: 14, marginTop: 2 },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    height: "62%",
    paddingHorizontal: 26,
  },
  column: { flex: 1, alignItems: "center", gap: 10, height: "100%" },
  track: { flex: 1, width: "100%", justifyContent: "flex-end" },
  bar: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: "rgba(242,242,245,0.14)",
  },
  barPeak: { backgroundColor: TINT },
  day: { color: MUTED, fontSize: 11 },
});
