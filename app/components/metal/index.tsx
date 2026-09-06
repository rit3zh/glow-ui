import Metal from "@/components/organisms/metal";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";
import { FontAwesome } from "@expo/vector-icons";

const _size: number = 28;
const _colors: string[] = [
  "#120703",
  "#321006",
  "#67210C",
  "#B74616",
  "#FFD0A8",
  "#F47732",
  "#8E3011",
  "#210A04",
];
export default function MetalScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <Metal
          borderWidth={8}
          bevel={3.5}
          noiseScale={0.88}
          sharpness={2}
          colors={_colors}
        >
          <View style={styles.box}>
            <FontAwesome name="heart" size={_size} color="#fff" />
          </View>
        </Metal>
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
  box: {
    width: 100,
    height: 100,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
  },
});
