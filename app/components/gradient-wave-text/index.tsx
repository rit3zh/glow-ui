import React, { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { GradientWaveText } from "@/components";
import { Showcase } from "~/showcase";
import { useFonts } from "expo-font";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const diagonal = Math.hypot(SCREEN_WIDTH, SCREEN_HEIGHT);
const _FONT_SIZE = Math.round(Math.sqrt(SCREEN_WIDTH * SCREEN_HEIGHT) / 6.6);
export default function GradientWaveTextScreen() {
  const [fontLoaded, _] = useFonts({
    Elingston: require("~/assets/fonts/elingston.otf"),
  });
  const [paused, setPaused] = useState<boolean>(true);
  const onPress = () => {
    setPaused((prev) => !prev);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      onPress();
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Showcase>
      <View style={styles.content}>
        <GradientWaveText
          bandGap={5}
          speed={0.9}
          paused={paused}
          textStyle={[
            styles.hero,
            {
              fontFamily: fontLoaded ? "Elingston" : undefined,
            },
          ]}
        >
          Reacticx
        </GradientWaveText>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    // paddingHorizontal: 28,
    alignItems: "center",
  },

  hero: {
    fontSize: _FONT_SIZE,
    fontStyle: "italic",
  },
});
