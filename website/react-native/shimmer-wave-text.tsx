import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
  View,
  StyleSheet,
  type TextStyle,
  type StyleProp,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Animated, {
  withTiming,
  Easing,
  withRepeat,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import type {
  AnimationState,
  FloatConfig,
  LayoutDimensions,
  RoundConfig,
  ShimmerConfig,
  ShimmerWaveTextProps,
  ISyncedAnimatedCharacter,
  ISyncedTextRenderer,
} from "./types";
import {
  DEFAULT_FLOAT_CONFIG,
  DEFAULT_ROUND_CONFIG,
  DEFAULT_SHIMMER_CONFIG,
  DEFAULT_TEXT,
  DEFAULT_TEXT_COLOR,
  MASK_COLOR,
  PADDING,
} from "./conf";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedCharacter = memo<ISyncedAnimatedCharacter>(
  ({
    char,
    charIndex,
    style,
    textColor,
    floatConfig,
    shimmerProgress,
    totalChars,
    shimmerWidth,
  }: ISyncedAnimatedCharacter): JSX.Element => {
    const charPosition = totalChars > 1 ? charIndex / (totalChars - 1) : 0;

    const shimmerRange = 1 + shimmerWidth * 2;

    const shimmerCenterAtChar = (charPosition + shimmerWidth) / shimmerRange;

    const windowSize = shimmerWidth / shimmerRange;

    const floatProgress = useDerivedValue(() => {
      const shimmerPos = shimmerProgress.value;
      const distance = Math.abs(shimmerPos - shimmerCenterAtChar);
      if (distance < windowSize) {
        const normalizedDistance = distance / windowSize;
        return Math.cos(normalizedDistance * Math.PI) * 0.5 + 0.5;
      }

      return 0;
    }, [shimmerCenterAtChar, windowSize]);

    const animatedStyle: StyleProp<TextStyle> = useAnimatedStyle((): {
      transform: Array<{ translateY: number } | { scale: number }>;
    } => {
      const translateY: number = floatProgress.value * -floatConfig.distance;
      const scale: number = 1 + floatProgress.value * floatConfig.scaleAmount;

      return {
        transform: [{ translateY }, { scale }],
      };
    }, [floatConfig.distance, floatConfig.scaleAmount]);

    return (
      <Animated.Text style={[style, { color: textColor }, animatedStyle]}>
        {char}
      </Animated.Text>
    );
  },
);

const TextRenderer: React.FC<ISyncedTextRenderer> = memo<ISyncedTextRenderer>(
  ({
    words,
    textStyle,
    textColor,
    floatConfig,
    shimmerProgress,
    totalChars,
    shimmerWidth,
    isMask = false,
  }: ISyncedTextRenderer): React.ReactNode &
    JSX.Element &
    React.ReactElement => {
    const renderContent = useMemo((): React.ReactNode & JSX.Element[] => {
      let charIndex: number = 0;
      const keyPrefix: string = isMask ? "mask" : "char";
      const color: string = isMask ? MASK_COLOR : textColor;

      return words.flatMap<React.JSX.Element>(
        (word: string, wordIndex: number): React.JSX.Element[] => {
          const chars: string[] = Array.from(word);
          const wordChars: React.JSX.Element[] = chars.map(
            (char: string): React.JSX.Element => {
              const currentCharIndex: number = charIndex;
              charIndex++;
              return (
                <AnimatedCharacter
                  key={`${keyPrefix}-${currentCharIndex}`}
                  char={char}
                  charIndex={currentCharIndex}
                  style={textStyle}
                  textColor={color}
                  floatConfig={floatConfig}
                  shimmerProgress={shimmerProgress}
                  totalChars={totalChars}
                  shimmerWidth={shimmerWidth}
                />
              );
            },
          );

          if (wordIndex < words.length - 1) {
            const spaceIndex = charIndex;
            charIndex++;
            wordChars.push(
              <AnimatedCharacter
                key={`${keyPrefix}-space-${wordIndex}`}
                char=" "
                charIndex={spaceIndex}
                style={textStyle}
                textColor={color}
                floatConfig={floatConfig}
                shimmerProgress={shimmerProgress}
                totalChars={totalChars}
                shimmerWidth={shimmerWidth}
              />,
            );
          }

          return wordChars;
        },
      );
    }, [
      words,
      textStyle,
      textColor,
      floatConfig,
      shimmerProgress,
      totalChars,
      shimmerWidth,
      isMask,
    ]);

    return <>{renderContent}</>;
  },
);

export const ShimmerWaveText: React.FC<ShimmerWaveTextProps> =
  memo<ShimmerWaveTextProps>(
    ({
      text = DEFAULT_TEXT,
      containerStyle,
      textStyle,
      textColor = DEFAULT_TEXT_COLOR,
      shimmerConfig = {},
      floatConfig = {},
      roundConfig = {},
    }: ShimmerWaveTextProps): React.ReactNode & JSX.Element => {
      const mergedShimmerConfig: ShimmerConfig = useMemo<ShimmerConfig>(
        (): ShimmerConfig => ({
          ...DEFAULT_SHIMMER_CONFIG,
          ...shimmerConfig,
        }),
        [shimmerConfig],
      );

      const mergedFloatConfig: FloatConfig = useMemo<FloatConfig>(
        (): FloatConfig => ({
          ...DEFAULT_FLOAT_CONFIG,
          ...floatConfig,
        }),
        [floatConfig],
      );

      const mergedRoundConfig: RoundConfig = useMemo<RoundConfig>(
        (): RoundConfig => ({
          ...DEFAULT_ROUND_CONFIG,
          ...roundConfig,
        }),
        [roundConfig],
      );

      const shimmerProgress: SharedValue<number> = useSharedValue<number>(0);
      const [dimensions, setDimensions] = useState<LayoutDimensions>({
        width: 0,
        height: 0,
      });
      const [roundTrigger, setRoundTrigger] = useState<number>(0);
      const animationStateRef = React.useRef<AnimationState>({
        currentRound: 0,
      });

      const words: readonly string[] = useMemo<readonly string[]>(
        (): readonly string[] => text.split(" "),
        [text],
      );

      const totalChars: number = useMemo<number>((): number => {
        return text.length;
      }, [text]);

      const flattenedTextStyle: TextStyle = useMemo(
        (): TextStyle =>
          StyleSheet.flatten([styles.text, textStyle]) as TextStyle,
        [textStyle],
      );

      const startNextRound = useCallback((): void => {
        animationStateRef.current.currentRound += 1;
        setRoundTrigger((prev: number): number => prev + 1);
      }, []);

      useEffect((): void => {
        if (dimensions.width > 0) {
          const isInfinite: boolean = mergedRoundConfig.total === -1;

          if (isInfinite) {
            shimmerProgress.value = withRepeat(
              withTiming(1, {
                duration: mergedShimmerConfig.duration,
                easing: Easing.linear,
              }),
              -1,
              false,
            );
          } else {
            const animateRound = (): void => {
              shimmerProgress.value = 0;
              shimmerProgress.value = withTiming(
                1,
                {
                  duration: mergedShimmerConfig.duration,
                  easing: Easing.linear,
                },
                (finished?: boolean): void => {
                  if (finished) {
                    ("worklet");
                    if (
                      animationStateRef.current.currentRound <
                      mergedRoundConfig.total - 1
                    ) {
                      setTimeout((): void => {
                        scheduleOnRN<[], void>(startNextRound);
                      }, mergedRoundConfig.delayBetween);
                    }
                  }
                },
              );
            };
            animateRound();
          }
        }
      }, [
        dimensions.width,
        mergedShimmerConfig.duration,
        mergedRoundConfig.total,
        mergedRoundConfig.delayBetween,
        roundTrigger,
        shimmerProgress,
        startNextRound,
      ]);

      const animatedShimmerStyle: StyleProp<ViewStyle> =
        useAnimatedStyle<ViewStyle>((): {
          transform: Array<{ translateX: number }>;
        } => {
          const shimmerWidthValue: number =
            dimensions.width * mergedShimmerConfig.width;
          const translateX: number = interpolate(
            shimmerProgress.value,
            [0, 1],
            [-shimmerWidthValue, dimensions.width + shimmerWidthValue],
          );

          return {
            transform: [{ translateX }],
          };
        }, [dimensions.width, mergedShimmerConfig.width]);

      const handleLayout = useCallback((event: LayoutChangeEvent): void => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }, []);

      const shimmerWidthValue: number = useMemo<number>(
        (): number => dimensions.width * mergedShimmerConfig.width,
        [dimensions.width, mergedShimmerConfig.width],
      );

      const extraSpace: number =
        mergedFloatConfig.distance + mergedFloatConfig.scaleAmount * 10;

      return (
        <View style={[styles.container, containerStyle]}>
          <View
            style={[
              styles.contentWrapper,
              {
                paddingTop: PADDING + extraSpace,
                paddingBottom: PADDING,
                paddingHorizontal: PADDING,
              },
            ]}
            onLayout={handleLayout}
          >
            <View style={[styles.textWrapper, styles.hiddenLayer]}>
              <TextRenderer
                words={words}
                textStyle={flattenedTextStyle}
                textColor={textColor}
                floatConfig={mergedFloatConfig}
                shimmerProgress={shimmerProgress}
                totalChars={totalChars}
                shimmerWidth={mergedShimmerConfig.width}
              />
            </View>

            {dimensions.width > 0 && (
              <MaskedView
                style={[
                  StyleSheet.absoluteFill,
                  {
                    width: dimensions.width,
                    height: dimensions.height + extraSpace * 2,
                    left: PADDING,
                    top: PADDING,
                  },
                ]}
                maskElement={
                  <View
                    style={[styles.textWrapper, { paddingTop: extraSpace }]}
                  >
                    <TextRenderer
                      words={words}
                      textStyle={flattenedTextStyle}
                      textColor={MASK_COLOR}
                      floatConfig={mergedFloatConfig}
                      shimmerProgress={shimmerProgress}
                      totalChars={totalChars}
                      shimmerWidth={mergedShimmerConfig.width}
                      isMask
                    />
                  </View>
                }
              >
                <View
                  style={[
                    styles.shimmerContainer,
                    {
                      width: dimensions.width,
                      height: dimensions.height + extraSpace * 2,
                      backgroundColor: textColor,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      {
                        width: shimmerWidthValue,
                        height: "100%",
                      },
                      animatedShimmerStyle,
                    ]}
                  >
                    <LinearGradient
                      colors={
                        mergedShimmerConfig.colors as [
                          string,
                          string,
                          string,
                          string,
                          string,
                          string,
                        ]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: shimmerWidthValue,
                        height: "100%",
                      }}
                    />
                  </Animated.View>
                </View>
              </MaskedView>
            )}
          </View>
        </View>
      );
    },
  );

ShimmerWaveText.displayName = "ShimmerWaveText";

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  contentWrapper: {
    position: "relative",
    overflow: "visible",
  },
  textWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "visible",
  },
  text: {
    fontSize: 18,
  },
  hiddenLayer: {
    opacity: 0,
  },
  shimmerContainer: {
    overflow: "visible",
  },
});
