import { AnimatedMeshGradient } from "@/components/organisms/mesh-gradient";
import * as React from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  return (
    <View style={stylez.container}>
      <AnimatedMeshGradient
        speed={1.5}
        contrast={1.5}
        noise={2}
        blur={0}
        animated={true}
      />
    </View>
  );
}

const stylez = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
