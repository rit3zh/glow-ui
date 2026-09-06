import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

import { SkiaRippleEffect } from "@/components/organisms/skia-ripple";
import { Showcase } from "~/showcase";

const { width } = Dimensions.get("window");

const CARD_WIDTH: number = 350;
const CARD_HEIGHT: number = 350;
const IMAGE_URI: string =
  "https://i.pinimg.com/736x/90/54/c9/9054c9d1c125fe8d48b457694d325003.jpg";

export default function SkiaRippleScreen() {
  const [fontLoaded] = useFonts({
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  const [, setLoaded] = useState<boolean>(false);

  const bold = fontLoaded ? "SfProRoundedBold" : undefined;
  const medium = fontLoaded ? "SfProRoundedMedium" : undefined;

  return (
    <Showcase>
      <View style={styles.stage}>
        <SkiaRippleEffect
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          borderRadius={20}
        >
          <View style={styles.card}>
            <Image
              source={{ uri: IMAGE_URI }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onLoad={() => setLoaded(true)}
            />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.98)"]}
              locations={[0, 0.55, 1]}
              style={styles.fade}
            />
            <View style={styles.content}>
              <Text style={[styles.title, { fontFamily: bold }]}>Be Free</Text>
              <Text style={[styles.subtitle, { fontFamily: medium }]}>
                Make every moment truly yours.
              </Text>
            </View>
          </View>
        </SkiaRippleEffect>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "flex-end",
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "50%",
  },
  content: {
    padding: 22,
    gap: 5,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    lineHeight: 21,
  },
  hint: {
    color: "#666",
    fontSize: 13,
  },
});
