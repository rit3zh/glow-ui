import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LiquidMetal } from "@/components";
import { Showcase } from "~/showcase";

export default function LiquidMetalScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LiquidMetal
          source={require("../../../assets/white_glow.png")}
          width={700}
          height={700}
          rotation={90}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    color: "#A47148",
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
