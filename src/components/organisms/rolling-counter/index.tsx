import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { type FC, memo, useState } from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BlurView, type BlurViewProps } from "expo-blur";
import type { ICounter, IReusableDigit } from "./types";
import { SPRING_CONFIG } from "./const";
import { scheduleOnRN } from "react-native-worklets";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedBlur =
  Animated.createAnimatedComponent<Partial<BlurViewProps>>(BlurView);

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
    springConfig,
    digitStyle,
  }: IReusableDigit):
    | (React.JSX.Element & React.ReactNode & React.ReactElement)
    | null => {
    const currentDigit = useDerivedValue<number>(() =>
      getDigitAtPlace(counterValue.value, place),
    );

    const slideY = useSharedValue<number>(0);

    const digitSlideStylez = useAnimatedStyle<Pick<ViewStyle, "transform">>(
      () => {
        const targetY = -height * currentDigit.value;

        slideY.value = withSpring(targetY, {
          ...springConfig,
        });

        return {
          transform: [
            { translateY: slideY.value },
            {
              scaleY: withSpring(
                interpolate(
                  Math.abs(slideY.value - targetY),
                  [0, height],
                  [1, 0.85],
                ),
                {
                  ...springConfig,
                },
              ),
            },
          ],
        };
      },
    );

    const blurEffectPropz = useAnimatedProps<Pick<BlurViewProps, "intensity">>(
      () => {
        const targetY = -height * currentDigit.value;
        const delta = Math.abs(slideY.value - targetY);
        const isMoving = delta > 0.5;

        return {
          intensity: isMoving
            ? withSpring<number>(interpolate(delta, [0, height], [0, 3.5]))
            : 0,
        };
      },
    );

    const animatedAndroidBlurStylez = useAnimatedStyle<
      Required<Partial<Pick<ViewStyle, "filter">>>
    >(() => {
      const targetY = -height * currentDigit.value;
      const delta = Math.abs(slideY.value - targetY);
      const isMoving = delta > 0.5;
      return {
        filter: [
          {
            blur: isMoving
              ? withSpring<number>(
                  interpolate(delta, [0, height], [0, 1.15]),
                  {},
                )
              : 0,
          },
        ],
      };
    });

    return (
      <View
        style={{
          height,
          width,
          overflow: "hidden",
        }}
      >
        <Animated.View style={digitSlideStylez}>
          {Array.from({ length: 10 }, (_, i) => (
            <Animated.Text
              key={i}
              style={[
                {
                  height,
                  width,
                  textAlign: "center",
                  lineHeight: height,
                  fontSize,
                  fontWeight: "bold",
                  color,
                  fontVariant: ["tabular-nums"],
                },
                Platform.OS === "android" && animatedAndroidBlurStylez,
                digitStyle,
              ]}
            >
              {i}
            </Animated.Text>
          ))}

          {Platform.OS === "ios" && (
            <AnimatedBlur
              animatedProps={blurEffectPropz}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
              tint="default"
            />
          )}
        </Animated.View>
      </View>
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
    springConfig = SPRING_CONFIG,
    digitStyle,
  }: ICounter):
    | (React.JSX.Element & React.ReactNode & React.ReactElement)
    | null => {
    const internalCounter = useSharedValue<number>(0);
    const animatedValue = typeof value === "number" ? internalCounter : value;

    const [totalDigits, setTotalDigits] = useState<number>(() => {
      const initialValue = typeof value === "number" ? value : value.value;
      return getDigitCount<number>(initialValue);
    });

    useDerivedValue<void>(() => {
      if (typeof value === "number") {
        internalCounter.value = value;
      }
    });

    useAnimatedReaction<number>(
      () => getDigitCount<number>(animatedValue.value),
      (newCount, prevCount) => {
        if (newCount !== prevCount) {
          scheduleOnRN(setTotalDigits, newCount);
        }
      },
      [animatedValue],
    );

    const containerAnimStyle = useAnimatedStyle<
      Partial<Pick<ViewStyle, "width">>
    >(() => ({
      width: withTiming<number>(
        getDigitCount<number>(animatedValue.value) * width,
        {
          duration: 250,
          easing: Easing.inOut(Easing.ease),
        },
      ),
    }));

    return (
      <Animated.View style={[styles.rowContainer, containerAnimStyle]}>
        {Array.from({ length: totalDigits }, (_, i) => {
          const placeIndex = totalDigits - 1 - i;
          return (
            <CounterDigit
              key={placeIndex}
              springConfig={springConfig}
              place={placeIndex}
              counterValue={animatedValue}
              height={height}
              digitStyle={digitStyle}
              width={width}
              color={color}
              fontSize={fontSize}
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
});

export { RollingCounter };
