import React, { memo, useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Path } from "react-native-svg";

import type { IVerifiedShine } from "./types";
import {
  BADGE_CHECK_PATH,
  BADGE_SHIELD_PATH,
  DEFAULT_CHECK_COLOR,
  DEFAULT_COLOR,
  DEFAULT_DELAY,
  DEFAULT_DURATION,
  DEFAULT_EASING,
  DEFAULT_SHINE_ANGLE,
  DEFAULT_SHINE_COLORS,
  DEFAULT_SHINE_WIDTH,
  DEFAULT_SIZE,
  VERIFIED_SHINE_VIEW_BOX,
} from "./conf";

export const VerifiedShine: React.FC<IVerifiedShine> = ({
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  checkColor = DEFAULT_CHECK_COLOR,
  shineColors = DEFAULT_SHINE_COLORS,
  shineWidth = DEFAULT_SHINE_WIDTH,
  shineAngle = DEFAULT_SHINE_ANGLE,
  duration = DEFAULT_DURATION,
  delay = DEFAULT_DELAY,
  easing = DEFAULT_EASING,
  paused = false,
  label = "Verified",
  style,
}: IVerifiedShine): React.JSX.Element => {
  const progress = useSharedValue<number>(0);

  const waveWidth = size * shineWidth;

  useEffect(() => {
    cancelAnimation<number>(progress);
    progress.value = 0;

    if (paused) return;

    progress.value = withRepeat<number>(
      withDelay<number>(delay, withTiming<number>(1, { duration, easing })),
      -1,
      false,
    );

    return () => cancelAnimation<number>(progress);
  }, [progress, paused, delay, duration, easing]);

  const waveStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [-waveWidth, size + waveWidth],
        ),
      },
      { rotate: `${shineAngle}deg` },
    ],
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[{ width: size, height: size }, style]}
    >
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <Svg width={size} height={size} viewBox={VERIFIED_SHINE_VIEW_BOX}>
            <Path d={BADGE_SHIELD_PATH} fill="#FFFFFF" />
          </Svg>
        }
      >
        <View style={[styles.fill, { backgroundColor: color }]}>
          <Animated.View
            style={[
              styles.wave,
              { width: waveWidth, height: size * 2, top: -size / 2 },
              waveStyle,
            ]}
          >
            <LinearGradient
              colors={shineColors as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fill}
            />
          </Animated.View>
        </View>
      </MaskedView>

      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        width={size}
        height={size}
        viewBox={VERIFIED_SHINE_VIEW_BOX}
      >
        <Path d={BADGE_CHECK_PATH} fill={checkColor} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    left: 0,
  },
});

export default memo<React.FC<IVerifiedShine>>(VerifiedShine);
