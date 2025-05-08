import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ActionCardTypes } from "./ActionCard.types";

export const ActionCard: React.FunctionComponent<ActionCardTypes> &
  React.FC<ActionCardTypes> = ({
  children,
  className,
  style,
}): React.ReactNode & React.JSX.Element => {
  return (
    <View className={className} style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    marginTop: 15,
  },
});
