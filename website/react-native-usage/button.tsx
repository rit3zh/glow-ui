import { View, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Button } from "@/components/base/button";
import { CircularLoader } from "@/components/molecules/circular-loader";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onPress = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <Button
        loadingText="Fetching…"
        isLoading={loading}
        onPress={onPress}
        loadingTextColor="#000"
        showLoadingIndicator
        loadingTextStyle={{
          fontFamily: fontLoaded ? "SfProRounded" : undefined,
        }}
        renderLoadingIndicator={() => (
          <View style={{ marginRight: 8 }}>
            <CircularLoader
              size={18}
              strokeWidth={2.5}
              enableBlur
              gradientLength={50}
              duration={500}
            />
          </View>
        )}
      >
        <View style={styles.btn}>
          <Ionicons name="arrow-forward" size={18} color="black" />
          <Text
            style={[
              styles.btnText,
              {
                fontFamily: fontLoaded ? "SfProRounded" : undefined,
              },
            ]}
          >
            Click Me!
          </Text>
        </View>
      </Button>
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
