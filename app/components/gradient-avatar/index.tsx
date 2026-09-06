import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { GradientAvatar } from "@/components/base/gradient-avatar";
import { Showcase } from "~/showcase";

const SIZE: number = 65;

export default function GradientAvatarScreen() {
  const insets = useSafeAreaInsets();
  const [fontLoaded] = useFonts({
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  const bold = fontLoaded ? "SfProRoundedBold" : undefined;
  const medium = fontLoaded ? "SfProRoundedMedium" : undefined;

  return (
    <Showcase>
      <View
        style={[
          styles.content,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <View style={styles.gradientRow}>
          <GradientAvatar token="I" size={SIZE} rounding={99} />
          <GradientAvatar token="Love" size={SIZE} rounding={99} />
          <GradientAvatar token="Reacticx" size={SIZE} rounding={99} />
          <GradientAvatar token="❤️" size={SIZE} rounding={99} />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    color: "#fff",
    marginBottom: 4,
  },
  gradientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
