import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import WaveScrawler from "@/components/organisms/wave-scrawler";
import { Showcase } from "~/showcase";

const IMAGES = [
  {
    uri: "https://i.pinimg.com/736x/6f/50/a1/6f50a1f250c5386e5122cd7fcb0d3c96.jpg",
  },
  {
    uri: "https://i.pinimg.com/736x/06/e4/e2/06e4e2b04d36b195ebd3486e357d2432.jpg",
  },
  {
    uri: "https://i.pinimg.com/1200x/67/24/20/672420f267b76e2c68904a9d9902717d.jpg",
  },
];

export default function WaveScrawlerExample() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % IMAGES.length);

  return (
    <Showcase>
      <View style={styles.container}>
        <View style={styles.card}>
          <WaveScrawler
            source={IMAGES}
            index={index}
            amplitude={2}
            colorSeparation={15}
            style={styles.scrawler}
          />
          <Pressable onPress={next} style={StyleSheet.absoluteFill} />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 320,
    height: 420,
    // borderRadius: 24,
    overflow: "hidden",

    backgroundColor: "#1a1a1a",
  },
  scrawler: {
    flex: 1,
  },
  dots: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    backgroundColor: "#fff",
  },
});
