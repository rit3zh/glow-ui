import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import type { AnimatedMaskedTextProps } from "./AnimatedMaskedText.types";

export const AnimatedMaskedText: React.FC<AnimatedMaskedTextProps> = ({
  children,
  style,
  speed = 1,
  colors = ["transparent", "rgba(255,255,255,0.7)", "transparent"],
}) => {
  const shimmerTranslate = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = React.useState(0);
  useEffect(() => {
    const animate = () => {
      shimmerTranslate.setValue(-1);
      Animated.loop(
        Animated.timing(shimmerTranslate, {
          toValue: 1,
          duration: 2000 / speed,
          easing: Easing.inOut(Easing.ease),

          useNativeDriver: true,
        })
      ).start();
    };

    animate();
  }, [shimmerTranslate]);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [0, 1],
    outputRange: [-textWidth * speed, textWidth + 100 * speed],
  });

  return (
    <MaskedView
      maskElement={
        <Text
          style={[styles.text, style]}
          onTextLayout={(e) => setTextWidth(e.nativeEvent.lines[0].width)}
        >
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
              inputRange: [0, 1],
              outputRange: [0.6, 1],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", ...colors] as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  gradient: {
    width: 300,
    height: 50,
  },
});
