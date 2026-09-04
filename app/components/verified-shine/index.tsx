import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VerifiedShine } from "@/components/micro-interactions/verified-shine";
import { Showcase } from "~/showcase";

export default function VerifiedShineScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <VerifiedShine size={140} shineWidth={1} />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 36,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    color: "#FAFAFA",
    fontSize: 17,
    fontWeight: "700",
  },
});
