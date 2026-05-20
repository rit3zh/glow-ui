import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UnstableOrb } from "@/components/organisms/unstable_orb";

export default function HomeScreen() {
  const [intensity, setIntensity] = useState<number>(0.6);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.orbWrapper}>
        <UnstableOrb
          intensity={intensity}
          colorShift={0.15}
          style={{ width: 220, height: 220 }}
        />
      </View>
      <View style={{ position: "absolute", bottom: 400 }}>
        <Button
          title={intensity > 0 ? "Stop Thinking" : "Start Thinking"}
          onPress={() => {
            setIntensity(intensity > 0 ? 0 : 2);
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",

    justifyContent: "center",
    alignItems: "center",
  },

  orbWrapper: {
    borderRadius: 28,
    padding: 16,
    bottom: 300,

    overflow: "hidden",

    // barely-there depth (optional)
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
});
