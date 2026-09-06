import { DynamicText } from "@/components/molecules/dynamic-text";
import { DynamicTextItem } from "@/components/molecules/dynamic-text/types";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Showcase } from "~/showcase";

const greetings: readonly DynamicTextItem[] = [
  { text: "Hello", id: "en" },
  { text: "こんにちは", id: "ja" },
  { text: "Bonjour", id: "fr" },
  { text: "Hola", id: "es" },
  { text: "안녕하세요", id: "ko" },
] as const;

export default function App(): React.JSX.Element & React.ReactNode {
  return (
    <Showcase>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <DynamicText
            items={greetings}
            initialIndex={2}
            paused={false}
            loop
            dot={{
              size: 5,
            }}
          />
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
