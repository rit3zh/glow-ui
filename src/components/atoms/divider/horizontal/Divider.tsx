import { StyleSheet } from "react-native";
import React from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

export const HorizontalDivider: React.FC = (): React.JSX.Element => {
  return <Animated.View layout={LinearTransition} style={styles.spacer} />;
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});
