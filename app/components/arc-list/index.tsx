import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ArcList } from "@/components";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Showcase } from "~/showcase";
const MOTTOS = [
  "Become",
  "Wander",
  "Breathe",
  "Awaken",
  "Create",
  "Remember",
  "Begin Again",
  "Stay Wild",
  "Keep Wonder",
  "Follow The Light",
  "Lost & Found",
  "Into The Unknown",
  "Nothing Lasts",
  "Here & Now",
  "After The Rain",
  "Let It Flow",
  "Find Your Way",
  "Beyond The Ordinary",
  "Until The End",
  "While We Can",
];

const CARD_HEIGHT = 340;

const _width = 268;
const CARD_BG = "#000";
const FADE_HEIGHT = 120;

const FADE_STOPS = [1, 0.98, 0.92, 0.8, 0.62, 0.42, 0.24, 0.1, 0.03, 0];
const fade = (alpha: number) => `rgba(5, 5, 5, ${alpha})`;
const TOP_FADE = FADE_STOPS.map(fade) as [string, string, ...string[]];
const BOTTOM_FADE = [...FADE_STOPS].reverse().map(fade) as [
  string,
  string,
  ...string[],
];
const FADE_LOCATIONS = FADE_STOPS.map((_, i) => i / (FADE_STOPS.length - 1));
export default function ArcListScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });
  return (
    <Showcase>
      <SafeAreaView style={styles.container}>
        <View style={styles.stage}>
          <View style={styles.card}>
            <LinearGradient
              pointerEvents="none"
              style={[styles.fade, styles.fadeTop]}
              colors={TOP_FADE}
              locations={FADE_LOCATIONS as any}
            />
            <ArcList.Root
              height={CARD_HEIGHT}
              itemHeight={44}
              minOpacity={0.5}
              radius={360}
              defaultIndex={8}
            >
              <ArcList.Viewport>{ROWS}</ArcList.Viewport>
            </ArcList.Root>
            <LinearGradient
              pointerEvents="none"
              style={[styles.fade, styles.fadeBottom]}
              colors={BOTTOM_FADE}
              locations={FADE_LOCATIONS as any}
            />
          </View>
        </View>
      </SafeAreaView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, gap: 4 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  subtitle: { color: "#6b6b6b", fontSize: 13 },
  stage: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    width: _width,
    height: CARD_HEIGHT,
    paddingLeft: 18,
    borderRadius: 28,
    backgroundColor: CARD_BG,
    overflow: "hidden",
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    height: FADE_HEIGHT,
    zIndex: 1,
  },
  fadeTop: { top: 0 },
  fadeBottom: { bottom: 0 },
  plus: { fontSize: 12, lineHeight: 14, fontWeight: "700" },
  label: { fontSize: 19, fontFamily: "SfProRounded" },
  caption: {
    paddingBottom: 24,
    textAlign: "center",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#8a8a8a",
  },
});

const ROWS = MOTTOS.map((life_motto) => (
  <ArcList.Item key={life_motto}>
    <ArcList.Label color="#c9c9c9" activeColor="#ffffff" style={styles.label}>
      {life_motto}
    </ArcList.Label>
  </ArcList.Item>
));
