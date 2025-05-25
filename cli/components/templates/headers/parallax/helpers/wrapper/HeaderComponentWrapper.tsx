import { View, Text, StyleSheet, ViewStyle, SafeAreaView } from "react-native";
import React from "react";
import type { HeaderComponentWrapperProps } from "../../types";
import { LinearGradient } from "expo-linear-gradient";

export const HeaderComponentWrapper: React.FC<HeaderComponentWrapperProps> = ({
  children,
  useGradient,
  gradientColors,
  gradientHeight,
  ...props
}: HeaderComponentWrapperProps): React.ReactNode & React.JSX.Element => {
  return (
    <View style={[styles.container, props as ViewStyle]}>
      {children}
      {useGradient && (
        <LinearGradient
          colors={gradientColors as any}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: gradientHeight,
          }}
        />
      )}

      {/* <LinearGradient
        colors={["transparent", "black"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 400,
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
