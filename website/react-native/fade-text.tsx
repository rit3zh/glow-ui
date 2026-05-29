import { BlurView, type BlurViewProps } from "expo-blur";
import React, { memo, useEffect } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { AnimatedWordProps, FadeTextProps } from "./types";
import { Platform } from "react-native";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

export const FadeText: React.FC<FadeTextProps> = memo<FadeTextProps>(
  ({
    inputs,
    wordDelay = 300,
    duration = 800,
    blurIntensity = [30, 10, 0],
    blurTint = "dark",
    scaleRange = [0.97, 1],
    translateYRange = [10, 0],
    opacityRange = [0, 0.5, 1],
    fontSize = 32,
    fontWeight = "600",
    color = "#ffffff",
    textAlign = "center",
    containerStyle,
    style,
  }: FadeTextProps): React.ReactNode & React.JSX.Element => {
    const words = inputs.flatMap((text, inputIndex) =>
      text.split(" ").map((word) => ({ word, inputIndex })),
    );

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.textWrapper}>
          {words.map((item, index) => (
            <AnimatedWord
              key={index}
              word={item.word}
              index={index}
              delay={index * wordDelay}
              duration={duration}
              blurIntensity={blurIntensity}
              blurTint={blurTint}
              scaleRange={scaleRange}
              translateYRange={translateYRange}
              opacityRange={opacityRange}
              fontSize={fontSize}
              style={style}
              fontWeight={fontWeight}
              color={color}
              textAlign={textAlign}
            />
          ))}
        </View>
      </View>
    );
  },
);

const AnimatedWord: React.FC<AnimatedWordProps> = memo<AnimatedWordProps>(
  ({
    word,
    delay,
    duration,
    blurIntensity,
    blurTint,
    scaleRange,
    translateYRange,
    opacityRange,
    fontSize,
    fontWeight,
    color,
    textAlign,
    style,
  }: AnimatedWordProps): React.ReactNode & React.JSX.Element => {
    const animationValue = useSharedValue<number>(0);

    useEffect(() => {
      animationValue.value = withDelay(
        delay,
        withTiming<number>(1, {
          duration,
          easing: Easing.out(Easing.cubic),
        }),
      );
    }, [delay, duration]);

    const animatedStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => {
      const opacity = interpolate(
        animationValue.value,
        [0, 0.8, 1],
        opacityRange,
        Extrapolation.CLAMP,
      );

      const scale = interpolate(
        animationValue.value,
        [0, 1],
        scaleRange,
        Extrapolation.CLAMP,
      );

      const translateY = interpolate(
        animationValue.value,
        [0, 1],
        translateYRange,
        Extrapolation.CLAMP,
      );

      return {
        opacity,
        transform: [{ scale }, { translateY }],
      };
    });

    const blurAnimatedProps = useAnimatedProps<
      Pick<BlurViewProps, "intensity">
    >(() => {
      const intensity = withSpring<number>(
        interpolate(
          animationValue.value,
          [0, 0.3, 1],
          blurIntensity,
          Extrapolation.CLAMP,
        ),
      );

      return {
        intensity,
      };
    });

    const animatedAndroidBlurViewStylez = useAnimatedStyle<
      Pick<ViewStyle, "filter">
    >(() => {
      const blur = withSpring<number>(
        interpolate(
          animationValue.value,
          [0, 0.3, 1],
          blurIntensity,
          Extrapolation.CLAMP,
        ),
      );

      return {
        filter: [
          {
            blur,
          },
        ],
      };
    });

    return (
      <Animated.View
        style={[
          styles.wordContainer,
          animatedStyle,
          animatedAndroidBlurViewStylez,
        ]}
      >
        <Text
          style={[
            styles.word,
            {
              fontSize,
              fontWeight,
              color,
              textAlign,
            },
            style,
          ]}
        >
          {word}{" "}
        </Text>
        {Platform.OS === "ios" && (
          <AnimatedBlurView
            style={[StyleSheet.absoluteFillObject]}
            animatedProps={blurAnimatedProps}
            tint={blurTint}
          />
        )}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  wordContainer: {
    overflow: "hidden",
    borderRadius: 4,
  },
  word: {},
});
