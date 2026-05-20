import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "@/components/atoms/pressable";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/base/button";
import { CircularLoader } from "@/components/molecules/Loaders/circular";
import DynamicText from "@/components/molecules/dynamic-text";
import ElasticSlider from "@/components/micro-interactions/elastic-slider";

const AVATARS = [
  {
    id: "1",
    uri: "https://i.pinimg.com/736x/26/92/88/269288cb8a78b511f77e6f9ba85c9e49.jpg",
    name: "Lawliet",
  },
  {
    uri: "https://i.pinimg.com/736x/cb/91/92/cb9192cce5390e4b8c5401e1bad473fb.jpg",
    id: "2",
    name: "Light",
  },
  {
    name: "Anime",
    id: "3",
    uri: "https://i.pinimg.com/1200x/d2/6e/31/d26e31e629d4d2d99a6d21fddf3e2035.jpg",
  },
  {
    uri: "https://i.pinimg.com/736x/86/5c/18/865c1872cd515d129756ea3fd67eac06.jpg",
    id: "4",
    name: "Aesthetic",
  },
];

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });

  const [val, setVal] = useState<number>(34);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <ElasticSlider
        defaultValue={val}
        style={{
          width: Dimensions.get("window").width - 220,
        }}
        onValueChange={setVal}
        renderLeadingAccessory={() => (
          <>
            <Ionicons name="volume-low" size={24} color="#fff" />
          </>
        )}
        renderTrailingAccessory={() => (
          <>
            <Ionicons name="volume-high" size={24} color="#fff" />
          </>
        )}
        fillColor="#fff"
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 110,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  btnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
});
