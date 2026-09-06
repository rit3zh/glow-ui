import { SpectralWave } from "@/components/organisms/spectral-wave";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Showcase } from "~/showcase";

export default function SpectralWaveScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });
  const fontRound = fontLoaded ? "SfProRounded" : undefined;

  return (
    <Showcase>
      <View style={styles.container}>
        <SpectralWave
          width={280}
          height={52}
          borderRadius={100}
          asChild
          borderWidth={0}
          timeScale={1}
          borderColor="#000"
        >
          <View style={styles.ctaInner}>
            <Text style={[styles.ctaText, { fontFamily: fontRound }]}>
              Reacticx
            </Text>
          </View>
        </SpectralWave>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaInner: {
    width: 270,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#0a0400",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    fontSize: 15,
    color: "#ffe8d1",
    fontWeight: "500",
  },
});
