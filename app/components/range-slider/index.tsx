import React from "react";
import { StyleSheet, View } from "react-native";
import { RangeSlider } from "@/components";
import { Showcase } from "~/showcase";

export default function RangeSliderScreen() {
  return (
    <Showcase>
      <View style={[styles.stage, {}]}>
        <RangeSlider defaultValue={4} min={1} max={10} step={1} />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 25,
  },
});
