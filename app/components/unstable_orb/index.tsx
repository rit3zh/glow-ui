import React, { useState } from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UnstableOrb } from "@/components/organisms/unstable_orb";
import { Showcase } from "~/showcase";
const colors = ["#ed5d1f", "#FFD84D", "#9c4f03"];
export default function HomeScreen() {
  const [intensity, setIntensity] = useState<number>(0.6);
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <Pressable
          style={styles.orbWrapper}
          onPress={() => setIntensity(intensity > 0 ? 0 : 2)}
        >
          <UnstableOrb
            intensity={intensity}
            colorShift={10}
            style={{
              width: 550,
              height: 250,
              pointerEvents: "none",
              position: "absolute",
            }}
            colors={colors as any}
          />
        </Pressable>
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

  orbWrapper: {
    width: 400,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
});
