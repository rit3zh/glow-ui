import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MorphLoader } from "@/components";
import { Showcase } from "~/showcase";

const _MORPH_LOADER: number = 120;
const _COLOR: string = `#fff`;

export default function MorphLoaderScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            // paddingTop: insets.top + insets.bottom,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          },
        ]}
      >
        <MorphLoader
          size={_MORPH_LOADER}
          color={_COLOR}
          shapes={[
            "soft-burst",
            "cookie-9-sided",
            "pentagon",
            "pill",
            "sunny",
            "cookie-4-sided",
            "oval",
            "heart",
            "flower",
          ]}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: "center",
  },
});
