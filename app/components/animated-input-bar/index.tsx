import { View, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import AnimatedInputBar from "@/components/base/animated-input-bar";
import { Showcase } from "~/showcase";

const PLACEHOLDERS: string[] = [
  "Share your thoughts...",
  "What's on your mind?",
  "Type something interesting...",
  "Express yourself here...",
];

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });

  const [text, setText] = useState<string>("");
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.inputContainer}>
          <Ionicons
            name="add"
            size={18}
            color={"#fff"}
            style={{
              marginLeft: 10,
            }}
          />
          <View style={styles.divider} />
          <AnimatedInputBar
            placeholders={PLACEHOLDERS}
            value={text}
            characterDelayIncrement={12}
            animationInterval={1200}
            onChangeText={setText}
            selectionColor={"#353535"}
            placeholderStyle={{
              fontFamily: fontLoaded ? "SfProRounded" : undefined,
            }}
          />
        </View>
      </View>
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
  inputContainer: {
    width: Dimensions.get("window").width - 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingHorizontal: 16,
    borderRadius: 96,
    height: 46,
  },
  divider: {
    width: 0.4,
    backgroundColor: "#6e6e6e",
    height: 18,
    marginLeft: 18,
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
