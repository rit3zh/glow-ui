import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChromeBackdrop,
  LiquidChromeText,
  type BackdropVariant,
  type IChromeColors,
} from "@/components";
import { Showcase } from "~/showcase";

const PATTERN: IChromeColors = {
  sky: "#150A05",
  highlight: "#FFE3D1",
  shadow: "#2A0F06",
  ground: "#FF6A3D",
  base: "#8A2A12",
  spark: "#FFB894",
};

export default function LiquidChromeTextScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <LiquidChromeText
          text="rit3zh"
          colors={PATTERN}
          fontSizeRatio={0.9}
          fresnel={0.2}
          speed={2.5}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    alignItems: "center",
    justifyContent: "center",
  },
});
