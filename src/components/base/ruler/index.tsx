import React, { memo, useCallback, useEffect, useMemo } from "react";
import { Canvas, Group, Line } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withClamp,
  withDecay,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolation,
  withTiming,
} from "react-native-reanimated";
import { Platform } from "react-native";
import {
  AndroidHaptics,
  impactAsync,
  ImpactFeedbackStyle,
  performAndroidHapticsAsync,
} from "expo-haptics";
import {
  SPRING_CONFIG,
  SPRING_CONFIG_RESPONSIVE,
  SPRING_CONFIG_SOFT,
} from "./conf";
// @ts-check
import type { IRuler, ITick } from "./types";
import { scheduleOnRN } from "react-native-worklets";

const Tick = ({
  tickX,
  xCenter,
  yCenter,
  translateX,
  mountAnimation,
  notchHeight,
  notchWidth,
  tickColor,
  activeTickColor,
  step,
}: ITick) => {
  const distance = useDerivedValue(() => {
    return Math.abs(tickX + translateX.value - xCenter) / step;
  });

  const tickOpacity = useDerivedValue(() => {
    return (
      interpolate(
        distance.value,
        [0, 1, 3],
        [1, 0.6, 0.3],
        Extrapolation.CLAMP,
      ) * mountAnimation.value
    );
  });

  const clipFraction = useDerivedValue(() => {
    return interpolate(
      distance.value,
      [0, 1, 2],
      [0, 0.3, 0.6],
      Extrapolation.CLAMP,
    );
  });

  const baseline = yCenter + notchHeight / 2;

  const tickTop = useDerivedValue<number>(() => {
    return baseline - notchHeight * (1 - clipFraction.value);
  });

  const tickColorAnimated = useDerivedValue<string>(() => {
    return interpolateColor(
      distance.value,
      [0, 0.5, 1],
      [activeTickColor, activeTickColor, tickColor],
    );
  });

  return (
    <Line
      p1={useDerivedValue(() => ({ x: tickX, y: tickTop.value }))}
      p2={{ x: tickX, y: baseline }}
      color={tickColorAnimated}
      strokeWidth={notchWidth}
      strokeCap="round"
      opacity={tickOpacity}
    />
  );
};

export const Ruler: React.FC<IRuler> & React.FunctionComponent<IRuler> =
  memo<IRuler>(
    ({
      height,
      width,
      minValue,
      maxValue,
      step,
      onScroll,
      onValueChange,
      tickColor = "rgba(255, 255, 255, 0.6)",
      activeTickColor = "#00D4FF",
      backgroundColor = "transparent",
      notchHeight = 40,
      notchWidth = 3,
      enableHaptics = false,
      animateOnMount = true,
    }: IRuler): React.ReactNode & React.JSX.Element & React.ReactElement => {
      const xCenter = width / 2;
      const yCenter = height / 2;
      const translateX = useSharedValue<number>(animateOnMount ? -width : 0);
      const active = useSharedValue<boolean>(false);
      const mountAnimation = useSharedValue<number>(0);
      const lastHapticValue = useSharedValue<number>(0);

      const numbers = useMemo<number[]>(() => {
        const length = maxValue - minValue + 1;
        return Array.from({ length }, (_, i) => minValue + i);
      }, [minValue, maxValue]);

      const triggerHaptic = useCallback<() => void>(() => {
        if (enableHaptics) {
          if (Platform.OS === "ios") {
            impactAsync(ImpactFeedbackStyle.Light);
          } else {
            performAndroidHapticsAsync(AndroidHaptics.Segment_Tick);
          }
        }
      }, [enableHaptics]);

      const currentValue = useDerivedValue<number>(() => {
        const index = Math.round(-translateX.value / step);
        return Math.max(minValue, Math.min(maxValue, minValue + index));
      });

      useAnimatedReaction(
        () => currentValue.value,
        (value, previous) => {
          if (previous !== null && value !== previous && active.value) {
            if (enableHaptics) {
              scheduleOnRN(triggerHaptic);
            }
            lastHapticValue.value = value;
          }
          if (onValueChange) {
            scheduleOnRN(onValueChange, value);
          }
        },
        [onValueChange, enableHaptics],
      );

      useAnimatedReaction<number>(
        () => translateX.value,
        (value) => {
          if (onScroll) {
            scheduleOnRN(onScroll, value);
          }
        },
        [onScroll],
      );

      useEffect(() => {
        if (animateOnMount) {
          translateX.value = withSpring<number>(0, SPRING_CONFIG_SOFT);
        }
        mountAnimation.value = withTiming<number>(1, { duration: 600 });
      }, []);

      const pan = Gesture.Pan()
        .onChange((e) => {
          active.value = true;
          const _translateX = -(translateX.value + e.changeX);
          const maxTranslate = (numbers.length - 1) * step;

          if (_translateX < 0) {
            const resistance = 0.3;
            translateX.value = -_translateX * resistance;
          } else if (_translateX > maxTranslate) {
            const overshoot = _translateX - maxTranslate;
            const resistance = 0.3;
            translateX.value = -(maxTranslate + overshoot * resistance);
          } else {
            translateX.value = -_translateX;
          }
        })
        .onFinalize((e) => {
          const maxTranslate = (numbers.length - 1) * step;

          if (translateX.value > 0) {
            translateX.value = withSpring<number>(0, SPRING_CONFIG);
            active.value = false;
          } else if (translateX.value < -maxTranslate) {
            translateX.value = withSpring<number>(-maxTranslate, SPRING_CONFIG);
            active.value = false;
          } else {
            translateX.value = withClamp<number>(
              {
                min: -maxTranslate,
                max: 0,
              },
              withDecay(
                {
                  velocity: e.velocityX,
                  clamp: [-maxTranslate, 0],
                  deceleration: 0.997,
                },
                (finish) => {
                  if (finish) {
                    translateX.value = withSpring<number>(
                      Math.round(translateX.value / step) * step,
                      SPRING_CONFIG_RESPONSIVE,
                    );
                    active.value = false;
                  }
                },
              ),
            );
          }
        });

      const transform = useDerivedValue(() => {
        return [{ translateX: translateX.value }];
      });

      const ticksData = useMemo(() => {
        return numbers.map((_number, index) => ({
          index,
          tickX: index * step + xCenter,
        }));
      }, [numbers, step, xCenter]);
      return (
        <GestureDetector gesture={pan}>
          <Canvas style={{ width, height, backgroundColor }}>
            <Group transform={transform}>
              {ticksData.map((tick) => (
                <Tick
                  key={tick.index}
                  index={tick.index}
                  tickX={tick.tickX}
                  xCenter={xCenter}
                  yCenter={yCenter}
                  translateX={translateX}
                  mountAnimation={mountAnimation}
                  notchHeight={notchHeight}
                  notchWidth={notchWidth}
                  tickColor={tickColor}
                  activeTickColor={activeTickColor}
                  step={step}
                />
              ))}
            </Group>
          </Canvas>
        </GestureDetector>
      );
    },
  );

export default memo<React.FC<IRuler>>(Ruler);
