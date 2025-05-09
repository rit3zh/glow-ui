import * as React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import type { WhatsNewTitleProps } from "../WhatsNew.type";

export const WhatsNewTitle: React.FC<WhatsNewTitleProps> = ({
  children,
  secondaryColor = "#5cbeff",
}) => {
  if (typeof children !== "string") return null;

  const shouldSplit = children.length > 22;

  let firstLine = children;
  let secondLine = "";

  if (shouldSplit) {
    const words = children.trim().split(" ");
    const midpoint = Math.ceil(words.length / 1.4);
    firstLine = words.slice(0, midpoint).join(" ");
    secondLine = words.slice(midpoint).join(" ");
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textPrimary}>{firstLine}</Text>
      {secondLine ? (
        <Text
          style={[
            styles.textSecondary,
            {
              color: secondaryColor,
            },
          ]}
        >
          {secondLine}
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  textPrimary: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 44,
    textAlign: "center",
  },
  textSecondary: {
    fontSize: 38,
    fontWeight: "bold",
    color: "red",
    lineHeight: 36,
    textAlign: "center",
    top: 2.5,
  },
});
