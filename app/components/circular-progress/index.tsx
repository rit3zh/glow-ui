import { View, StyleSheet } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";

import { CircularProgress } from "@/components/organisms/circular-progress";
import { Showcase } from "~/showcase";

export default function App() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(72, {
      easing: Easing.bezier(0.95, 0.1, 0.95, 1),
      duration: 2000,
    });
  }, []);

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <View>
          <CircularProgress
            progress={progress}
            size={120}
            strokeWidth={12}
            outerCircleColor="rgba(255,255,255,0.15)"
            // progressCircleColor="#ff4757"
            backgroundColor="#0000000f"
            renderIcon={() => <></>}
          />
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
});
