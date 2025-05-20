import * as React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BACKGROUND_COLOR } from "../../../app.config";
import { ChipGroup } from "@/components";

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
export function Home({
  navigation,
  route, // eslint-disable-line @typescript-eslint/no-unused-vars
}: HomeProps): React.ReactElement {
  const [index, setIndex] = React.useState<number>(0);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>(Animated) Chip Group 🚀 </Text>
        <ChipGroup
          chips={[
            {
              label: "Primary",
              icon: "person",
              activeIcon: "person.fill",
              activeColor: "#0A84FF",
            },
            {
              label: "Notification",
              icon: "cart",
              activeIcon: "cart.fill",
              activeColor: "#FF453A",
            },
            {
              label: "Messages",
              icon: "bubble.left",
              activeIcon: "bubble.left.fill",
              activeColor: "#FF9F0A",
            },
            {
              label: "Promotions",
              icon: "megaphone",
              activeIcon: "megaphone.fill",
              activeColor: "#30D158",
            },
          ]}
          selectedIndex={index}
          onChange={(newIndex) => setIndex(newIndex)}
          containerStyle={{}}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: BACKGROUND_COLOR,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
});
