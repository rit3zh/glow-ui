import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UnstableSiriOrb } from "@/components/organisms/unstable_siri_orb";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <UnstableSiriOrb
        size={280}
        speed={1}
        style={{ marginTop: 50 }}
        noiseIntensity={1}
        glowIntensity={1.4}
        saturation={2}
        brightness={1}
        rotationSpeed={1}
        noiseScale={3}
        coreIntensity={0.55}
        edgeSoftness={0.045}
        primaryColor={{ r: 0.45, g: 0.65, b: 1.0 }}
        secondaryColor={{ r: 0.0, g: 0.85, b: 0.8 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
});
