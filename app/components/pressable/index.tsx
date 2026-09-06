import { View, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Pressable } from "@/components/atoms/pressable";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <Pressable
          pressAnimation={{
            scale: 0.97,
            useSpring: true,
            stiffness: 550,
            mass: 0.5,
            damping: 50,
            rotate: -5,
          }}
          feedback={{ haptic: true, hapticType: "medium" }}
        >
          <View style={styles.btn}>
            <Text
              style={[
                styles.btnText,
                fontLoaded && { fontFamily: "SfProRounded" },
              ]}
            >
              Get Started
            </Text>
          </View>
        </Pressable>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 99,
  },
  btnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
});
