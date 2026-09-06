import { AnimatedProgressBar } from "@/components";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Showcase } from "~/showcase";

export default function ProgressScreen() {
  const [progress, setProgress] = useState<number>(0);
  return (
    <Showcase>
      <View style={styles.container}>
        <AnimatedProgressBar
          progress={progress}
          containerStyle={{
            padding: 50,
          }}
          useGradient
          gradientColors={["#FFF3BF", "#FFD43B"]}
          borderRadius={99}
        />
        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setProgress((v) => v + 0.1)}
          >
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setProgress((v) => v - 0.1)}
          >
            <Text style={styles.buttonText}>-1</Text>
          </Pressable>
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
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1c1c1e",
  },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  row: { flexDirection: "row", gap: 12 },
});
