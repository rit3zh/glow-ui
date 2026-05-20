import React from "react";
import { StyleSheet, Text, View, Image as NativeImage } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { UnStableMetallicPaint } from "@/components/organisms/unstable_metallic-paint";

export default function HomeScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const logo = NativeImage.resolveAssetSource(
    require("../assets/white_glow.png"),
  ).uri;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <UnStableMetallicPaint
        unstable_uri={logo}
        size={500}
        liquid={1.5}
        patternBlur={0}
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

  marqueeWrapper: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",

    // optional – VERY subtle depth
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },

    overflow: "hidden",
  },
});
