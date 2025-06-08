import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Easing, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import type { AnimatedMaskedTextProps } from "./AnimatedMaskedText.types";

export const AnimatedMaskedText: React.FC<AnimatedMaskedTextProps> = ({
  children,
  style,
  speed = 1,
  colors = ["transparent", "rgba(255,255,255,1)", "transparent"],
  baseTextColor = "#000000", // Add base text color prop
}) => {
  const shimmerTranslate = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = React.useState(0);
  const [textHeight, setTextHeight] = React.useState(0);

  useEffect(() => {
    const animate = () => {
      shimmerTranslate.setValue(-1);
      Animated.loop(
        Animated.timing(shimmerTranslate, {
          toValue: 1,
          duration: 2000 / speed,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ).start();
    };
    animate();
  }, [shimmerTranslate, speed]);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-textWidth * 2.2, textWidth * 2.5],
  });

  return (
    <View style={{ position: "relative" }}>
      {/* Base text layer - visible text */}
      <Text
        style={[styles.text, style, { color: baseTextColor }]}
        onTextLayout={(e) => {
          const { width, height } = e.nativeEvent.lines[0];
          setTextWidth(width);
          setTextHeight(height);
        }}
      >
        {children}
      </Text>

      {/* Shimmer overlay */}
      {textWidth > 0 && (
        <MaskedView
          style={[
            StyleSheet.absoluteFill,
            {
              width: textWidth,
              height: textHeight || 50,
            },
          ]}
          maskElement={
            <Text style={[styles.text, style, { color: "white" }]}>
              {children}
            </Text>
          }
        >
          <Animated.View
            style={[
              {
                flexDirection: "row",
                transform: [{ translateX }],
                opacity: shimmerTranslate.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={colors as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: textWidth * 3,
                height: textHeight || 50,
              }}
            />
          </Animated.View>
        </MaskedView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
