import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BorderBeam } from "@/components";
import { Showcase } from "~/showcase";
import { SymbolView } from "expo-symbols";
import { useFonts } from "expo-font";

const RADIUS = 23;
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const RAF_SIZE = 19;
const _ICON_SIZE = RAF_SIZE * 0.89;

export default function BorderBeamScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });
  const insets = useSafeAreaInsets();
  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          },
        ]}
      >
        <BorderBeam
          style={styles.beam}
          borderRadius={RADIUS}
          borderWidth={0.5}
          colors={["#c15f3c", "#c15f3c", "#c15f3c"]}
          ambient={0}
          duration={3}
          intensity={0.9}
          glow={8}
        >
          <View style={styles.card}>
            <Text
              style={[
                styles.placeholder,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              Chat with Claude
            </Text>

            <View style={styles.row}>
              <Feather name="plus" size={_ICON_SIZE} color="#e9e9ee" />
              <View style={styles.model}>
                <Text
                  style={[
                    styles.modelText,
                    {
                      fontFamily: fontLoaded ? "SfProRoundedMedium" : undefined,
                    },
                  ]}
                >
                  Opus 4.8 Medium
                </Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={styles.actions}>
                <Feather name="mic" size={_ICON_SIZE} color="#e9e9ee" />
                <View style={styles.send}>
                  <SymbolView
                    name="waveform"
                    size={_ICON_SIZE}
                    tintColor="#000"
                  />
                </View>
              </View>
            </View>
          </View>
        </BorderBeam>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  beam: {
    width: WIDTH * 0.9,
  },
  card: {
    width: "100%",
    borderRadius: RADIUS,
    height: HEIGHT * 0.1_2,
    backgroundColor: "#121212",
    padding: 20,
  },
  placeholder: {
    color: "#6b6b73",
    fontSize: _ICON_SIZE * 0.87,
    fontWeight: "400",
    paddingBottom: _ICON_SIZE * 1.7,
    top: _ICON_SIZE / 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  model: {
    backgroundColor: "#1f1f1f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
  },
  modelText: {
    color: "#c9c9d1",
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    // flex: 1,
  },
  send: {
    width: 28,
    height: 28,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  stage: {
    padding: 12,
  },
});
