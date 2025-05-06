import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { AnimatedScrollViewTitleProps } from "../../types";

export const AnimatedScrollViewTitleWrapper: React.FC<
  AnimatedScrollViewTitleProps
> = ({ children }): React.ReactNode => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // This centers items vertically
    position: "relative", // Make the container relative for absolute positioning
  },
});
