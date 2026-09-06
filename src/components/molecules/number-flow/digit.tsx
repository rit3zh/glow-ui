import React, { memo, useEffect, useMemo } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";

import {
  DIGIT_HEIGHT_RATIO,
  DIGIT_WIDTH_RATIO,
  GLIDE_SPRING,
  LIVELY_SPRING,
  SCALE_MIN,
  SLIDE_FRACTION,
} from "./const";
import { styles } from "./styles";
import type { IDigitProps } from "./types";

const AnimatedText = Animated.createAnimatedComponent(Text);

const Digit = memo(
  ({
    value,
    place,
    active,
    enter,
    fontSize,
    color,
    fontWeight,
  }: IDigitProps) => {
    const target = Math.floor(value / place) % 10;

    const fullWidth = fontSize * DIGIT_WIDTH_RATIO;
    const height = fontSize * DIGIT_HEIGHT_RATIO;
    const mv = useSharedValue(enter ? 0 : target);
    const presence = useSharedValue(enter || !active ? 0 : 1);
    useEffect(() => {
      const current = mv.value;
      const candidate = target + Math.round((current - target) / 10) * 10;
      mv.value = withSpring(candidate, LIVELY_SPRING);
    }, [target, mv]);
    useEffect(() => {
      presence.value = withSpring(active ? 1 : 0, GLIDE_SPRING);
    }, [active, presence]);

    const cellStyle = useAnimatedStyle(() => {
      const p = Math.min(1, Math.max(0, presence.value));
      return { width: fullWidth * p, opacity: p };
    });
    const textStyle = useMemo(
      () => ({ fontSize, color, fontWeight, lineHeight: height }),
      [fontSize, color, fontWeight, height],
    );

    return (
      <Animated.View style={[styles.digit, { height }, cellStyle]}>
        {Array.from({ length: 10 }, (_, n) => (
          <Glyph
            key={n}
            mv={mv}
            number={n}
            height={height}
            textStyle={textStyle}
          />
        ))}
      </Animated.View>
    );
  },
);

const Glyph = memo(
  ({
    mv,
    number,
    height,
    textStyle,
  }: {
    mv: SharedValue<number>;
    number: number;
    height: number;
    textStyle: object;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const placeValue = ((mv.value % 10) + 10) % 10;
      let offset = (10 + number - placeValue) % 10;
      if (offset > 5) offset -= 10;

      const dist = Math.abs(offset);
      return {
        transform: [
          { translateY: offset * height * SLIDE_FRACTION },
          { scale: SCALE_MIN + (1 - SCALE_MIN) * Math.max(0, 1 - dist) },
        ],
        opacity: Math.max(0, 1 - dist),
      };
    });

    return (
      <Animated.View style={[styles.numberCell, animatedStyle]}>
        <AnimatedText style={[styles.glyph, textStyle]}>{number}</AnimatedText>
      </Animated.View>
    );
  },
);

export { Digit };
