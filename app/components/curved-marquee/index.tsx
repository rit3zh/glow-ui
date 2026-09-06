import { CurvedMarquee } from "@/components/organisms/curved-marquee";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";

export default function CurvedMarqueeScreen() {
  return (
    <Showcase>
      <View style={styles.container}></View>
      <CurvedMarquee direction="left" text="⋆ ✦ ⋆ REACTICX" />
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
});
