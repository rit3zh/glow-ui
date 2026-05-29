import React, { memo, useCallback, useMemo } from "react";
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
  index,
  tickX,
  xCenter,
  yCenter,
  translateX,
  mountAnimation,
  tickHeight,
  isLarge,
  tickColor,
  activeTickColor,
  step,
}: ITick) => {
  const distanceFromCenter = useDerivedValue(() => {
    return Math.abs(tickX + translateX.value - xCenter);
  });

  const proximity = useDerivedValue(() => {
    const activeZone = step * 0.6;
    return interpolate(
      distanceFromCenter.value,
      [0, activeZone, step],
      [1, 0.3, 0],
      Extrapolation.CLAMP,
    );
  });

  const baseOpacity = useDerivedValue(() => {
    return interpolate(
      distanceFromCenter.value,
      [0, 50, 150, 300],
      [1, 0.9, 0.6, 0.3],
      Extrapolation.CLAMP,
    );
  });

  const tickOpacity = useDerivedValue(() => {
    const proximityBoost = proximity.value * 0.15;
    return (
      Math.min(1, baseOpacity.value + proximityBoost) * mountAnimation.value
    );
  });

  const tickScale = useDerivedValue(() => {
    const baseScale = interpolate(
      distanceFromCenter.value,
      [0, 100, 200],
      [1, 0.96, 0.88],
      Extrapolation.CLAMP,
    );

    const popScale = interpolate(
      proximity.value,
      [0, 0.5, 1],
      [1, 1.04, 1.1],
      Extrapolation.CLAMP,
    );

    return baseScale * popScale;
  });
  const animatedTickHeight = useDerivedValue(() => {
    const extraHeight = interpolate(
      proximity.value,
      [0, 1],
      [0, 12],
      Extrapolation.CLAMP,
    );

    return (tickHeight + extraHeight) * tickScale.value;
  });

  const tickY1 = useDerivedValue(() => {
    const baseLift = interpolate(
      distanceFromCenter.value,
      [0, 50],
      [14, 15],
      Extrapolation.CLAMP,
    );
    const proximityLift = interpolate(
      proximity.value,
      [0, 1],
      [0, -5],
      Extrapolation.CLAMP,
    );

    return yCenter + baseLift + proximityLift;
  });

  const tickY2 = useDerivedValue<number>(() => {
    return withSpring(tickY1.value + animatedTickHeight.value);
  });

  const strokeWidth = useDerivedValue<number>(() => {
    const baseWidth = isLarge ? 2.5 : 1.5;
    const extraWidth = interpolate(
      proximity.value,
      [0, 1],
      [0, 1.2],
      Extrapolation.CLAMP,
    );
    return baseWidth + extraWidth;
  });
  const tickColorAnimated = useDerivedValue<string>(() => {
    return interpolateColor(
      proximity.value,
      [0, 0.4, 1],
      [tickColor, tickColor, activeTickColor],
    );
  });

  return (
    <Line
      p1={useDerivedValue(() => ({ x: tickX, y: tickY1.value }))}
      p2={useDerivedValue(() => ({ x: tickX, y: tickY2.value }))}
      color={tickColorAnimated}
      strokeWidth={strokeWidth}
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
      labelInterval = 10,
      tickColor = "rgba(255, 255, 255, 0.6)",
      activeTickColor = "#00D4FF",
      cursorColor = "#00D4FF",
      backgroundColor = "transparent",
      showCursor = true,
      tickHeights = { small: 30, medium: 38, large: 45 },
      enableHaptics = false,
      animateOnMount = true,
    }: IRuler) => {
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

      const currentValue = useDerivedValue(() => {
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

      useAnimatedReaction(
        () => translateX.value,
        (value) => {
          if (onScroll) {
            scheduleOnRN(onScroll, value);
          }
        },
        [onScroll],
      );

      React.useEffect(() => {
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

      const cursorScale = useDerivedValue(() => {
        return withSpring(active.value ? 1.15 : 1, {
          damping: 15,
          stiffness: 200,
          mass: 0.5,
        });
      });

      const cursorY1 = useDerivedValue(() => {
        const baseY = yCenter - 10;
        const lift = interpolate(
          cursorScale.value,
          [1, 1.15],
          [0, -3],
          Extrapolation.CLAMP,
        );
        return baseY + lift;
      });

      const cursorY2 = useDerivedValue<number>(() => {
        return yCenter + 5;
      });

      const ticksData = useMemo(() => {
        return numbers.map((number, index) => {
          const tickX = index * step + xCenter;
          const isLarge = index % labelInterval === 0;
          const isMedium = number % 5 === 0;
          const tickHeight = isLarge
            ? tickHeights.large
            : isMedium
              ? tickHeights.medium
              : tickHeights.small;

          return {
            index,
            tickX,
            isLarge,
            isMedium,
            tickHeight,
          };
        });
      }, [numbers, step, xCenter, labelInterval, tickHeights]);

      const cursorP1 = useDerivedValue(() => ({
        x: xCenter,
        y: cursorY1.value,
      }));
      const cursorP2 = useDerivedValue(() => ({
        x: xCenter,
        y: cursorY2.value,
      }));
      const cursorLeftP1 = useDerivedValue(() => ({
        x: xCenter - 6,
        y: cursorY1.value,
      }));
      const cursorLeftP2 = useDerivedValue(() => ({
        x: xCenter,
        y: cursorY1.value - 8,
      }));
      const cursorRightP1 = useDerivedValue(() => ({
        x: xCenter + 6,
        y: cursorY1.value,
      }));
      const cursorRightP2 = useDerivedValue(() => ({
        x: xCenter,
        y: cursorY1.value - 8,
      }));

      return (
        <GestureDetector gesture={pan}>
          <Canvas style={{ width, height, backgroundColor }}>
            {showCursor && (
              <Group>
                <Line
                  p1={cursorP1}
                  p2={cursorP2}
                  color={cursorColor}
                  strokeWidth={3}
                />
                <Line
                  p1={cursorLeftP1}
                  p2={cursorLeftP2}
                  color={cursorColor}
                  strokeWidth={3}
                />
                <Line
                  p1={cursorRightP1}
                  p2={cursorRightP2}
                  color={cursorColor}
                  strokeWidth={3}
                />
              </Group>
            )}

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
                  tickHeight={tick.tickHeight}
                  isLarge={tick.isLarge}
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
