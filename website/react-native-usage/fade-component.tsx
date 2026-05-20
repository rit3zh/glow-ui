import { FadeComponent } from "@/components/base/fade-component";
import { IFadeHandle } from "@/components/base/fade-component/types";
import React, { useRef } from "react";
import { StyleSheet, StatusBar, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App: React.FC = (): React.ReactNode => {
  const ref = useRef<IFadeHandle>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <FadeComponent ref={ref}>
        <FadeComponent.From>
          <Button
            title="Red"
            color={"red"}
            onPress={() => {
              ref?.current?.to!();
            }}
          />
        </FadeComponent.From>
        <FadeComponent.To>
          <Button
            title="Yellow"
            color={"yellow"}
            onPress={() => {
              ref?.current?.toggle!();
            }}
          />
        </FadeComponent.To>
      </FadeComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
  },
  marqueeWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  credits: {
    padding: 24,
    alignItems: "center",
  },
  creditsText: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  creditsLink: {
    fontSize: 12,
    color: "#00d4ff",
  },
});

export default App;
