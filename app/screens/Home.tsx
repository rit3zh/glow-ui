import * as React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { BACKGROUND_COLOR } from "../../app.config";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FloatingSheet } from "@/components/templates/sheet/floating-sheet/FloatingSheet";

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

export function Home({ navigation }: HomeProps): React.ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>React (Native) 🚀 </Text>
      {/* <FloatingSheet /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR || "#121212",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
});
