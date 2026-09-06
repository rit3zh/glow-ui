import React from "react";
import { StyleSheet, View } from "react-native";
import { NebulaOrb } from "@/components";
import { Showcase } from "~/showcase";

export default function NebulaOrbScreen() {
  return (
    <Showcase>
      <View style={styles.center}>
        <NebulaOrb size={260} color="#1a73f2" />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
});
