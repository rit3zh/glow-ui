import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import SegmentedControl from "@/components/organisms/segmented-control";
import { useFonts } from "expo-font";

import { Showcase } from "~/showcase";
const { width: _width } = Dimensions.get("window");

const TABS = [
  { icon: "home", label: "Home", color: "#000000" },
  { icon: "heart", label: "Favorites", color: "#000" },
  { icon: "user", label: "Profile", color: "#000000" },
] as const;

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const [index, setIndex] = useState(0);

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.card}>
          <SegmentedControl
            currentIndex={index}
            onChange={setIndex}
            paddingVertical={8.5}
            borderRadius={200}
            width={_width - 120}
            disableScaleEffect={false}
          >
            {TABS.map((tab) => (
              <View key={tab.label} style={styles.tab}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      fontFamily: fontLoaded ? "SfProRounded" : undefined,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            ))}
          </SegmentedControl>
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {},

  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  tabText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },

  content: {
    marginTop: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    maxWidth: 260,
  },
});
