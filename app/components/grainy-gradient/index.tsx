import React from "react";
import { StyleSheet, View } from "react-native";
import { GrainyGradient } from "@/components/organisms/grainy-gradient";

export default function App(): React.ReactNode &
  React.JSX.Element &
  React.ReactElement {
  return (
    <View style={stylez.container}>
      <GrainyGradient />
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
