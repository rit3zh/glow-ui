import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { TouchableRipple } from "@/components/base/ripple/Ripple";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimatedMaskedText, ActionCard } from "@/components";
import { SymbolView } from "expo-symbols";
import { FloatingSheet } from "@/components/templates/sheet/floating-sheet/FloatingSheet";

export function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <FloatingSheet />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  button: {
    backgroundColor: "#eee",
    width: 500,
    height: 500,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
  },
});
