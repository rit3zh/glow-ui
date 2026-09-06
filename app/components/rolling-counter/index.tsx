import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue, Easing } from "react-native-reanimated";

import { RollingCounter } from "@/components";
import { Showcase } from "~/showcase";

export default function RollingCounterScreen() {
  const counter = useSharedValue<number>(1234);
  const insets = useSafeAreaInsets();

  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          },
        ]}
      >
        <RollingCounter
          value={counter}
          height={72}
          width={46}
          timingConfig={{
            duration: 900,
            easing: Easing.bezier(0.2, 1, 0.48, 1),
          }}
          fontSize={58}
          fadeEdges
          motionBlur={true}
          color="#fff"
        />

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => (counter.value = counter.value - 1)}
          >
            <Text style={styles.buttonText}>-1</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => (counter.value = counter.value + 1)}
          >
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => (counter.value = counter.value + 111)}
          >
            <Text style={styles.buttonText}>+111</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => (counter.value = Math.floor(Math.random() * 5000))}
          >
            <Text style={styles.buttonText}>random</Text>
          </Pressable>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: "center", gap: 32 },
  row: { flexDirection: "row", gap: 12 },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1c1c1e",
  },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
