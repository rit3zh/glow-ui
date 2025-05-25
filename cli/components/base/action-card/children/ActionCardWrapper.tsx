import { View, Text, StyleSheet } from "react-native";
import React from "react";
import type { ActionCardSubtitleTypes } from "../ActionCard.types";

export const ActionCardWrapper: React.FC<ActionCardSubtitleTypes> &
  React.FunctionComponent<ActionCardSubtitleTypes> = ({
  children,
  className,
  style,
}): React.ReactNode => {
  return (
    <View className={className} style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 13.5,
  },
});
