import { View, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "@/components/atoms/pressable";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <Pressable
        pressAnimation={{
          scale: 0.97,
          useSpring: Boolean(true),
          stiffness: 200,
          damping: 20,
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
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </View>
      </Pressable>
    </GestureHandlerRootView>
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
    borderRadius: 16,
  },
  btnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
});
