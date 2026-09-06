import React from "react";
import { StyleSheet, View } from "react-native";
import { ChromeBackdrop } from "@/components";
import { Showcase } from "~/showcase";

export default function ChromeBackdropScreen() {
  return (
    <Showcase>
      <View style={styles.stage}>
        <ChromeBackdrop
          variant={"pool"}
          baseOpacity={1}
          asChild={false}
          grain={0.15}
          speed={5}
          borderRadius={0}
          accentColor="#000"
          baseColor="#a173ff"
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
