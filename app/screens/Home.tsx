import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BACKGROUND_COLOR } from "../../app.config";
import { Chip } from "@/components/molecules/Chip/Chip";

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
export function Home({
  navigation,
  route, // eslint-disable-line @typescript-eslint/no-unused-vars
}: HomeProps): React.ReactElement {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        {/* <Text style={styles.text}>React (Native) 🚀 </Text> */}
        <Chip />
        {/* <FloatingSheet /> */}
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
