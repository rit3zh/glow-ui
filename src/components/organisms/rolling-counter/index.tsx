import {
  Platform,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { type FC, memo, useEffect, useMemo, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BlurView, type BlurViewProps } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { scheduleOnRN } from "react-native-worklets";
import type { ICounter, IReusableDigit } from "./types";
import {
  EDGE_FADE,
  MASK_COLOR,
  MAX_BLUR_ANDROID,
  MAX_BLUR_IOS,
  SQUASH_X,
  SQUASH_Y,
  STAGGER,
  TILES,
  TIMING_CONFIG,
  WIDTH_TIMING_CONFIG,
} from "./const";

const AnimatedBlur =
  Animated.createAnimatedComponent<Partial<BlurViewProps>>(BlurView);

const IS_IOS = Platform.OS === "ios";

const wrap = <T extends number, M extends number>(num: T, mod: M): number => {
  "worklet";
  return ((num % mod) + mod) % mod;
};

const clamp = <T extends number>(num: T, min: number, max: number): number => {
  "worklet";
  return Math.min(Math.max(num, min), max);
};

const getDigitAtPlace = <T extends number, I extends number>(
  num: T,
  index: I,
): number => {
  "worklet";
  const str = Math.abs(Math.floor(num)).toString();
  return parseInt(str[str.length - 1 - index] || "0", 10);
};

const getDigitCount = <T extends number>(num: T): number => {
  "worklet";
  return Math.max(Math.abs(Math.floor(num)).toString().length, 1);
};

const CounterDigit: FC<IReusableDigit> = memo<IReusableDigit>(
  ({
    place,
    counterValue,
    height,
    width,
    color,
    fontSize,
    stagger,
    fadeEdges,
    motionBlur,
    timingConfig,
    springConfig,
    digitStyle,
  }: IReusableDigit):
    | (React.JSX.Element & React.ReactNode & React.ReactElement)
    | null => {
    const settled = getDigitAtPlace(counterValue.value, place);

    const offset = useSharedValue<number>(settled);
    const travelFrom = useSharedValue<number>(settled);
    const travelTo = useSharedValue<number>(settled);

    useAnimatedReaction<number>(
      () => counterValue.value,
      (current, previous) => {
        if (previous === null || current === previous) return;

        const next = getDigitAtPlace(current, place);
        if (next === getDigitAtPlace(previous, place)) return;

        const from = wrap(offset.value, 10);
        const forward = current > previous;
        const delta = forward ? wrap(next - from, 10) : -wrap(from - next, 10);
        if (delta === 0) return;

        travelFrom.value = offset.value;
        travelTo.value = offset.value + delta;

        const roll = springConfig
          ? withSpring<number>(travelTo.value, springConfig)
          : withTiming<number>(travelTo.value, timingConfig);

        offset.value =
          stagger > 0 ? withDelay<number>(place * stagger, roll) : roll;
      },
      [place, stagger, springConfig, timingConfig],
    );

    const motion = useDerivedValue<number>(() => {
      if (!motionBlur) return 0;
      const span = travelTo.value - travelFrom.value;
      if (span === 0) return 0;

      const progress = clamp((offset.value - travelFrom.value) / span, 0, 1);
      // Smoothstep'd bell: ramps in and out without the sharp sine shoulders.
      const bell = Math.sin(Math.PI * progress) ** 2;
      const reach = clamp(Math.abs(span) / 9, 0, 1);

      return bell * reach;
    });

    const windowStylez = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
      transform: [
        { scaleY: 1 - SQUASH_Y * motion.value },
        { scaleX: 1 - SQUASH_X * motion.value },
      ],
    }));

    const stripStylez = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
      transform: [{ translateY: -height * wrap(offset.value, 10) }],
    }));

    const blurPropz = useAnimatedProps<Pick<BlurViewProps, "intensity">>(
      () => ({
        intensity: interpolate(motion.value, [0, 1], [0, MAX_BLUR_IOS]),
      }),
    );

    const androidBlurStylez = useAnimatedStyle<
      Required<Partial<Pick<ViewStyle, "filter">>>
    >(() => ({
      filter: [{ blur: motion.value * MAX_BLUR_ANDROID }],
    }));

    const windowSize = useMemo<ViewStyle>(
      () => ({ height, width }),
      [height, width],
    );

    const tileStyle = useMemo<TextStyle>(
      () => ({
        height,
        width,
        lineHeight: height,
        textAlign: "center",
        fontSize,
        fontWeight: "bold",
        color,
        fontVariant: ["tabular-nums"],
      }),
      [height, width, fontSize, color],
    );

    const strip = (
      <Animated.View style={stripStylez}>
        {Array.from({ length: TILES }, (_, i) => (
          <Animated.Text key={i} style={[tileStyle, digitStyle]}>
            {i % 10}
          </Animated.Text>
        ))}
      </Animated.View>
    );

    return (
      <Animated.View
        entering={FadeIn.duration(220)}
        exiting={FadeOut.duration(160)}
        style={[
          styles.window,
          windowSize,
          windowStylez,
          !IS_IOS && motionBlur && androidBlurStylez,
        ]}
      >
        {fadeEdges ? (
          <MaskedView
            style={windowSize}
            maskElement={
              <LinearGradient
                colors={["transparent", MASK_COLOR, MASK_COLOR, "transparent"]}
                locations={[0, EDGE_FADE, 1 - EDGE_FADE, 1]}
                style={styles.fill}
              />
            }
          >
            {strip}
          </MaskedView>
        ) : (
          strip
        )}

        {IS_IOS && motionBlur && (
          <AnimatedBlur
            animatedProps={blurPropz}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
            tint="systemThinMaterial"
          />
        )}
      </Animated.View>
    );
  },
);

const RollingCounter: FC<ICounter> = memo(
  ({
    value,
    height = 60,
    width = 40,
    fontSize = 48,
    color = "#000",
    springConfig,
    timingConfig = TIMING_CONFIG,
    stagger = STAGGER,
    fadeEdges = true,
    motionBlur = true,
    digitStyle,
    style,
  }: ICounter):
    | (React.JSX.Element & React.ReactNode & React.ReactElement)
    | null => {
    const initialValue = typeof value === "number" ? value : value.value;

    const internalCounter = useSharedValue<number>(
      typeof value === "number" ? value : 0,
    );
    const animatedValue = typeof value === "number" ? internalCounter : value;

    const [totalDigits, setTotalDigits] = useState<number>(() =>
      getDigitCount<number>(initialValue),
    );

    const rowWidth = useSharedValue<number>(
      getDigitCount<number>(initialValue) * width,
    );

    useEffect(() => {
      if (typeof value === "number") internalCounter.value = value;
    }, [value, internalCounter]);

    useAnimatedReaction<number>(
      () => getDigitCount<number>(animatedValue.value),
      (next, previous) => {
        if (previous === null || next === previous) return;
        rowWidth.value = withTiming<number>(next * width, WIDTH_TIMING_CONFIG);
        scheduleOnRN(setTotalDigits, next);
      },
      [animatedValue, width],
    );

    const rowStylez = useAnimatedStyle<Partial<Pick<ViewStyle, "width">>>(
      () => ({ width: rowWidth.value }),
    );

    return (
      <Animated.View style={[styles.rowContainer, rowStylez, style]}>
        {Array.from({ length: totalDigits }, (_, i) => {
          const placeIndex = totalDigits - 1 - i;
          return (
            <CounterDigit
              key={placeIndex}
              place={placeIndex}
              counterValue={animatedValue}
              height={height}
              width={width}
              color={color}
              fontSize={fontSize}
              stagger={stagger}
              fadeEdges={fadeEdges}
              motionBlur={motionBlur}
              timingConfig={timingConfig}
              springConfig={springConfig}
              digitStyle={digitStyle}
            />
          );
        })}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  window: {
    overflow: "hidden",
  },
  fill: {
    flex: 1,
  },
});

export { RollingCounter };
