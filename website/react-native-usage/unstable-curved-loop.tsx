import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { UnstableAurora } from "@/components/organisms/unstable_aurora";
import { useFonts } from "expo-font";
import UnStableCurvedLoopMarquee from "@/components/organisms/curved-marquee";
import { PulsingDots } from "@/components";

export default function HomeScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{
          width: "100%",
          top: 50,
          position: "absolute",
        }}
      >
        <UnStableCurvedLoopMarquee text={`✦ React Native`} fontSize={120} />
      </View>
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
