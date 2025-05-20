import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  SafeAreaView,
} from "react-native";
import { AnimatedProgressBar } from "@/components/organisms/progress/AnimatedProgress";
import { BACKGROUND_COLOR } from "../../../app.config.js";

export const Home: React.FC & React.FunctionComponent = (): React.ReactNode &
  React.JSX.Element &
  React.JSX.Element => {
  const [progress, setProgress] = useState<number>(0);
  const handleReset = () => {
    setProgress(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Progress Bar</Text>
          <AnimatedProgressBar
            progress={0.2}
            useGradient={true}
            width={"100%"}
            borderRadius={200}
            gradientColors={["#FF512F", "#DD2476"]}
            trackColor="#3d3d3d"
          />
          <Text style={styles.description}>
            Current progress: {Math.round(progress * 100)}%
          </Text>

          <Button title="Reset" onPress={handleReset} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
