import React, { useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { ExpandableButton } from "@/components/index";
import { BACKGROUND_COLOR } from "../../../app.config";

export const Home: React.FC & React.FunctionComponent = (): React.ReactNode &
  React.JSX.Element &
  React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const handlePress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ExpandableButton
          isLoading={loading}
          gradientColors={["#FF512F", "#DD2476"]}
          icon="user-check"
          title="Check Me"
          animationConfig={{
            damping: 400,
            stiffness: 200,
            duration: 300,
          }}
          onPress={handlePress}
        />
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
