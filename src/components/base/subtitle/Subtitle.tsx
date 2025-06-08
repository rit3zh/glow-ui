// make subtitle component
import React from "react";
import { Text, StyleSheet } from "react-native";
import type { SubtitleProps } from "./Subtitle.props";

export const Subtitle: React.FC<SubtitleProps> = ({
  children,
  size = 13.5,
  style,
  className,
}): React.ReactNode => {
  return (
    <Text
      className={className}
      style={[
        styles.text,
        {
          maxWidth: "90%",
          fontSize: size ? size : 13.5,
        },
        style,
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
