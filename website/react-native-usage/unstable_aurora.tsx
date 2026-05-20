import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { UnstableAurora } from "@/components/organisms/unstable_aurora";
import { useFonts } from "expo-font";

export default function HomeScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <UnstableAurora
        direction="top"
        blend={0.9}
        amplitude={0.91}
        colors={["#00FF9C", "#5FD4FF", "#7A5CFF"]}
      />

      <View style={styles.overlay}>
        <SymbolView
          name="sparkles"
          size={28}
          tintColor="rgba(255,255,255,0.9)"
        />

        <Text
          style={[
            styles.title,
            {
              fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
            },
          ]}
        >
          Aurora
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: fontLoaded ? "SfProRounded" : undefined,
            },
          ]}
        >
          Procedural shader background
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  title: {
    color: "#fff",
    fontSize: 28,
  },

  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
});
