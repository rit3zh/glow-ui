import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Carousel3D } from "@/components";

const KEYWORDS = [
  "night",
  "city",
  "sky",
  "sunset",
  "sunrise",
  "winter",
  "skyscraper",
  "building",
  "cityscape",
  "architecture",
  "street",
  "lights",
  "downtown",
  "bridge",
];

const PHOTOS = KEYWORDS.map(
  (keyword) => `https://picsum.photos/seed/${keyword}/600/600`,
);

export default function Carousel3DScreen() {
  const [index, setIndex] = useState<number>(0);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <Carousel3D
          data={PHOTOS}
          onIndexChange={setIndex}
          cylinderWidth={1200}
          perspectiveFactor={12}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  content: { padding: 16, gap: 4 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  subtitle: { color: "#6b6b6b", fontSize: 13 },
  caption: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#8a8a8a",
  },
});
