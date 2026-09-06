import * as React from "react";
import { SquircleView } from "@/components/base/squircle-view";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";
import { SymbolView } from "expo-symbols";

export default function SquircleViewScreen() {
  return (
    <Showcase>
      <View style={styles.stage}>
        <SquircleView
          style={styles.view}
          backgroundColor="#fe3737"
          cornerRadius={59}
        >
          <View style={styles.container}>
            <SymbolView
              name="square.stack.3d.down.right.fill"
              tintColor={"#ddebe0"}
              size={100}
            />
          </View>
        </SquircleView>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
