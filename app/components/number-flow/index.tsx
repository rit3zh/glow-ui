import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NumberFlow } from "@/components";
import { Showcase } from "~/showcase";

export default function NumberFlowScreen() {
  const [value, setValue] = useState<number>(1234);
  const insets = useSafeAreaInsets();
  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            paddingTop: insets.top * 5,
          },
        ]}
      >
        <NumberFlow value={value} groupSeparator="," fontSize={90} />

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setValue((v) => v - 1)}
          >
            <Text style={styles.buttonText}>-1</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setValue((v) => v + 1)}
          >
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setValue((v) => v + 111)}
          >
            <Text style={styles.buttonText}>+111</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setValue(Math.floor(Math.random() * 199999))}
          >
            <Text style={styles.buttonText}>random</Text>
          </Pressable>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: "center" },
  row: { flexDirection: "row", gap: 12 },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1c1c1e",
  },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
