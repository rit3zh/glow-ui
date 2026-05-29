import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Picker } from "@/components/organisms/picker";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function App() {
  const [selected, setSelected] = useState("Day");
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <Text
        style={[styles.label, fontLoaded && { fontFamily: "SfProRounded" }]}
      >
        Select a time
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          items={["Day", "Afternoon", "Evening", "Night"]}
          backgroundColor="#000"
          hapticFeedback={true}
          onItemChange={(item) => setSelected(item)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    // justifyContent: "cen1ter",
    paddingHorizontal: 50,
    marginTop: 90,
  },
  label: {
    color: "#666",
    fontSize: 16,
    position: "absolute",
    top: 70,
    zIndex: 222,
  },
  selected: {
    color: "#fff",
    fontSize: 48,
    marginBottom: 40,
  },
  pickerWrapper: {
    width: "100%",
  },
});
