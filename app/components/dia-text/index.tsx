import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DiaText } from "@/components";
import { Showcase } from "~/showcase";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function DiaTextScreen() {
  return (
    <Showcase>
      <View style={styles.center}>
        <Animated.View style={styles.headline} layout={LinearTransition}>
          <Text style={styles.word}>Make every moment</Text>
          <DiaText
            loop
            loopDelay={900}
            text={["beautiful.", "effortless.", "memorable."]}
            baseColor="#f6f3ec"
            bandRatio={0.7}
            textStyle={styles.word}
          />
        </Animated.View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headline: {
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
  },
  word: {
    color: "#f6f3ec",
    fontSize: 20,
    fontWeight: "300",
    letterSpacing: -0.5,
  },
});
