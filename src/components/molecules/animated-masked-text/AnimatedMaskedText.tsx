import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Text, StyleSheet, Easing, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import type { IAnimatedMaskedText } from "./AnimatedMaskedText.types";

export const AnimatedMaskedText: React.FC<IAnimatedMaskedText> &
  React.FunctionComponent<IAnimatedMaskedText> = memo<IAnimatedMaskedText>(
  ({
    children,
    style,
    speed = 1,
    colors = [
      "transparent",
      "rgba(255,255,255,0.5)",
      "rgba(255,255,255,1)",
      "rgba(255,255,255,0.2)",
      "transparent",
    ],
    textWaveLength = 0.8,
    baseTextColor = "#000000",
  }: IAnimatedMaskedText): React.ReactNode &
    React.JSX.Element &
    React.ReactElement => {
    const shimmerTranslate = useRef<Animated.Value>(
      new Animated.Value(0),
    ).current;
    const [textWidth, setTextWidth] = useState<number>(0);
    const [textHeight, setTextHeight] = useState<number>(0);

    useEffect(() => {
      if (textWidth > 0) {
        shimmerTranslate.setValue(0);
        Animated.loop(
          Animated.timing(shimmerTranslate, {
            toValue: 1,
            duration: 2500 / speed,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ).start();
      }
    }, [shimmerTranslate, speed, textWidth]);

    const waveWidth = textWidth * textWaveLength;

    const translateX = shimmerTranslate.interpolate<number>({
      inputRange: [0, 1],
      outputRange: [-waveWidth, textWidth + waveWidth],
    });

    return (
      <View style={{ position: "relative" }}>
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
            <View
              style={{
                width: textWidth,
                height: textHeight || 50,
                backgroundColor: baseTextColor,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  transform: [{ translateX }],
                  width: waveWidth,
                  height: textHeight || 50,
                }}
              >
                <LinearGradient
                  colors={colors as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: waveWidth,
                    height: textHeight || 50,
                  }}
                />
              </Animated.View>
            </View>
          </MaskedView>
        )}
      </View>
    );
  },
);

export default memo<
  React.FC<IAnimatedMaskedText> & React.FunctionComponent<IAnimatedMaskedText>
>(AnimatedMaskedText);

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
