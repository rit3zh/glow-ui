// make subtitle component
import React from "react";
import { Text, StyleSheet } from "react-native";
import type { SubtitleProps } from "./Subtitle.props";

export const Subtitle: React.FC<SubtitleProps> = ({
  children,
}): React.ReactNode => {
  return (
    <Text
      style={[
        styles.text,
        {
          maxWidth: "90%",
        },
      ]}
      numberOfLines={2}
    >
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    fontWeight: "medium",
    color: "#a8a8a8",
    top: 3.5,
  },
});
