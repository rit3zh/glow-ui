import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

import { SiriIOS27 } from "@/components/organisms/siri-ios-27";
import { Showcase } from "~/showcase";

const { width, height } = Dimensions.get("window");

const longestSide = Math.max(width, height);

const SIZE = longestSide * 0.5;

const PALETTES: { key: string; swatch: string; colors?: string[] }[] = [
  { key: "rainbow", swatch: "#ffffff", colors: undefined },
  {
    key: "ocean",
    swatch: "#00c6ff",
    colors: ["#00c6ff", "#0072ff", "#00ffa3"],
  },
  {
    key: "sunset",
    swatch: "#ff6a00",
    colors: ["#ff6a00", "#ee0979", "#ffd200"],
  },
  { key: "mint", swatch: "#2af598", colors: ["#2af598", "#08aeea"] },
  {
    key: "violet",
    swatch: "#c471f5",
    colors: ["#fa71cd", "#c471f5", "#7873f5"],
  },
];

export default function SiriIos27Screen() {
  const [active, setActive] = useState(0);

  return (
    <Showcase>
      <View style={styles.stage}>
        <SiriIOS27
          width={SIZE}
          height={SIZE}
          colors={PALETTES[active].colors}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swatches: {
    flexDirection: "row",
    gap: 14,
    marginTop: 24,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchActive: {
    borderColor: "#ffffff",
  },
});
