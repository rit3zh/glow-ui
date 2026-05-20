import React from "react";
import { StyleSheet, View } from "react-native";
import MorphLoader from "@/components/organisms/morph-loader";

export default function MorphLoaderExample() {
  return (
    <View style={styles.container}>
      <MorphLoader
        size={120}
        color="#FF5722"
        rotationDuration={1000}
        morphDuration={1200}
      />
    </View>
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
    borderRadius: 24,
    overflow: "hidden",
    bottom: 150,
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
