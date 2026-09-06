import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import Animated, {
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import SpinButton from "@/components/micro-interactions/spin-button";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <Animated.View style={styles.content} layout={LinearTransition}>
          <SpinButton
            colors={{
              active: {
                background: "#121212",
                text: "#fff",
              },
            }}
            spinnerConfig={{
              containerBackground: "#121212",
            }}
            animationConfig={{
              spring: {
                damping: 50,
                stiffness: 250,
                mass: 1,
              },
            }}
          />
        </Animated.View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 140,
  },
});
