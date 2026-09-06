import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import AnimatedText from "@/components/organisms/animated-text";
import { useEffect, useState } from "react";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    StretchPro: require("@/assets/fonts/StretchPro.otf"),
  });

  const TEXTS: string[] = [
    "Do you like this?",
    "Isn't it awesome?",
    "Reacticx makes it easy.",
    "Enjoy using Reacticx!",
  ];

  const [text, setText] = useState<string>(TEXTS[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % TEXTS.length;
      setText(TEXTS[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View>
          <AnimatedText
            text={text}
            animationConfig={{
              spring: {
                damping: 15,
                stiffness: 210,
                mass: 1,
              },
              characterDelay: 15,
              maxBlurIntensity: 50,
            }}
            enterFrom={{
              opacity: 0,
              translateY: 55,
              scale: 0.2,
              rotate: 0,
            }}
            exitFrom={{
              opacity: 1,
              translateY: 0,
              scale: 1,
              rotate: 0,
            }}
            style={{
              color: "#fff",
              fontSize: 30,
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
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  year: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 4,
  },
  artist: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
  },
});
