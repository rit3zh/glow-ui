import { AnimatedMeshGradient } from "@/components/organisms/mesh-gradient";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";
const _size = 250;
export default function App() {
  return (
    <AnimatedMeshGradient
      speed={1}
      contrast={0.5}
      noise={2}
      colors={[
        { r: 1.0, g: 0.82, b: 0.18 },
        { r: 1.0, g: 0.48, b: 0.12 },
        { r: 0.95, g: 0.25, b: 0.18 },
        { r: 0.35, g: 0.08, b: 0.12 },
      ]}
      blur={1.5}
      animated={true}
    />
  );
}

const stylez = StyleSheet.create({
  container: {
    flex: 1,
  },
});
