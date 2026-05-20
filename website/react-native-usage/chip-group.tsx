import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { ChipGroup } from "@/components";
import { useState } from "react";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const [selected, setSelected] = useState(0);

  const chips = [
    {
      label: "All",
      activeColor: "#fff",
      inActiveBackgroundColor: "#1a1a1a",
      labelColor: "#000",
      icon: () => (
        <SymbolView
          resizeMode="scaleAspectFit"
          name="square.grid.2x2.fill"
          size={18}
          tintColor={selected === 0 ? "#000" : "#555"}
        />
      ),
    },
    {
      label: "Music",
      activeColor: "#ff375f",
      inActiveBackgroundColor: "#1a1a1a",
      labelColor: "#fff",
      icon: () => (
        <SymbolView
          resizeMode="scaleAspectFit"
          name="music.note"
          size={18}
          tintColor={selected === 1 ? "#fff" : "#555"}
        />
      ),
    },
    {
      label: "Videos",
      activeColor: "#5e5ce6",
      inActiveBackgroundColor: "#1a1a1a",
      labelColor: "#fff",
      icon: () => (
        <SymbolView
          name="play.fill"
          size={18}
          tintColor={selected === 2 ? "#fff" : "#555"}
          resizeMode="scaleAspectFit"
        />
      ),
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            fontLoaded && { fontFamily: "HelveticaNowDisplay" },
          ]}
        >
          Media
        </Text>
        <Text
          style={[
            styles.subtitle,
            fontLoaded && { fontFamily: "SfProRounded" },
          ]}
        >
          Browse your collection
        </Text>

        <View style={styles.chipWrapper}>
          <ChipGroup
            chips={chips}
            selectedIndex={selected}
            onChange={setSelected}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 100,
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#444",
  },
  chipWrapper: {
    marginTop: 24,
  },
});
