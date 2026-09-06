import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import AnimatedMaskedText from "@/components/molecules/animated-masked-text/AnimatedMaskedText";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.content}>
          <AnimatedMaskedText
            style={{
              fontSize: 80,
              fontWeight: "200",
            }}
            textWaveLength={1}
            baseTextColor="#2a2a2a"
          >
            Reacticx
          </AnimatedMaskedText>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
  },
});
