import { View, Text, Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useFonts } from "expo-font";
import CheckBox from "@/components/organisms/check-box";

export default function App() {
  const [checked, setChecked] = useState(false);
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    StretchPro: require("@/assets/fonts/StretchPro.otf"),
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ marginTop: 100 }}>
        <Pressable onPress={() => setChecked(!checked)} style={styles.card}>
          <View style={styles.left}>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                },
              ]}
            >
              Love Reacticx?
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              Tap to toggle
            </Text>
          </View>

          <View style={styles.checkbox}>
            <CheckBox
              checked={checked}
              checkmarkColor="#fff"
              stroke={5.5}
              size={60}
            />
          </View>
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  left: {
    gap: 2,
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  checkbox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
});
