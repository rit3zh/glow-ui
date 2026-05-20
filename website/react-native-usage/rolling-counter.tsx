import { StyleSheet, Text, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useSharedValue } from "react-native-reanimated";
import { RollingCounter } from "@/components/organisms/rolling-counter";
import { useFonts } from "expo-font";

export default function App() {
  const counter = useSharedValue<number>(10);

  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const increment = () => {
    counter.value = counter.value + Math.floor(Math.random() * 250) + 1;
    console.log(counter.value + Math.floor(Math.random() * 250) + 1);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <Pressable style={styles.card} onPress={increment}>
        <Text
          style={[
            styles.label,
            {
              fontFamily: fontLoaded ? "SfProRounded" : undefined,
            },
          ]}
        >
          Total Downloads
        </Text>
        <RollingCounter
          value={counter}
          height={64}
          width={42}
          springConfig={{
            stiffness: 110,
            damping: 14,
            mass: 0.5,
          }}
          fontSize={52}
          color="#fff"
        />
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  card: {
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 24,
    top: 100,

    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.12)",
  },
  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  hint: {
    marginTop: 14,
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
});
