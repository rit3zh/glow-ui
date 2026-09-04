import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Switch } from "@/components";
import { Showcase } from "~/showcase";

export default function SwitchScreen() {
  return (
    <Showcase>
      <View style={styles.stage}>
        <View style={styles.row}>
          <Switch.Root trackColor="#FF375F">
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
