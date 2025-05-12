import { SafeAreaView, StyleSheet, Text } from "react-native";
import { BACKGROUND_COLOR, TEXT } from "./app.config";
import { Pagination } from "@/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        {/* <Text style={styles.text}>{TEXT}</Text> */}
        <Pagination activeIndex={2} totalItems={5} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});
