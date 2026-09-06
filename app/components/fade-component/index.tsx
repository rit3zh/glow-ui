import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeComponent } from "@/components/base/fade-component";
import type { TFadeState } from "@/components/base/fade-component/types";
import { Showcase } from "~/showcase";

const PLANS = {
  from: { label: "Monthly", price: "$12", cadence: "per month" },
  to: { label: "Yearly", price: "$96", cadence: "per year" },
} as const;

const STATES: TFadeState[] = ["from", "to"];

const Plan: React.FC<{ plan: (typeof PLANS)[TFadeState] }> = ({ plan }) => (
  <View style={styles.card}>
    <Text style={styles.price}>{plan.price}</Text>
    <Text style={styles.cadence}>{plan.cadence}</Text>
  </View>
);

const App: React.FC = (): React.ReactNode => {
  const [state, setState] = useState<TFadeState>("from");

  const onChange = useCallback((next: TFadeState): void => {
    setState(next);
  }, []);

  return (
    <Showcase>
      <SafeAreaView style={styles.container}>
        <FadeComponent
          state={state}
          animation="spring"
          onChange={onChange}
          style={styles.fade}
        >
          <FadeComponent.From hiddenScale={0.96}>
            <Plan plan={PLANS.from} />
          </FadeComponent.From>
          <FadeComponent.To hiddenScale={0.96}>
            <Plan plan={PLANS.to} />
          </FadeComponent.To>
        </FadeComponent>

        <View style={styles.segment}>
          {STATES.map((value) => {
            const active = state === value;

            return (
              <Pressable
                key={value}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => setState(value)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    active && styles.segmentTextActive,
                  ]}
                >
                  {PLANS[value].label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </Showcase>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  fade: {
    width: 260,
    height: 160,
  },
  card: {
    width: 260,
    height: 160,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  cadence: {
    marginTop: 6,
    fontSize: 13,
    color: "#7A7A8A",
  },
  segment: {
    flexDirection: "row",
    marginTop: 24,
    padding: 4,
    borderRadius: 999,
    backgroundColor: "#16161F",
  },
  segmentItem: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
  },
  segmentItemActive: {
    backgroundColor: "#2A2A38",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7A7A8A",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
});

export default App;
