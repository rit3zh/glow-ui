import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { WhatsNewWrapperProps } from "../WhatsNew.type";

export const WhatsNewWrapper: React.FC<WhatsNewWrapperProps> &
  React.FunctionComponent<WhatsNewWrapperProps> = ({
  children,
}: WhatsNewWrapperProps): React.ReactNode => {
  return (
    <React.Fragment>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginLeft: 10,
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
    bottom: 2.5,
  },
});
