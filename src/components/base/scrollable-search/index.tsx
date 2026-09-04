// @ts-check
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useMemo,
  memo,
  useEffect,
} from "react";
import { BlurView, type BlurViewProps } from "expo-blur";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import type {
  IAnimatedComponent,
  IFocusedScreen,
  IOverlay,
  IScrollableSearch,
  IScrollableSearchContext,
  IScrollContent,
} from "./types";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

const ScrollableSearchContext = createContext<IScrollableSearchContext | null>(
  null,
);

const useScrollableSearch = () => {
  const context = useContext<IScrollableSearchContext | null>(
    ScrollableSearchContext,
  );
  if (!context) {
    throw new Error(
      "ScrollableSearch compound components must be rendered within <ScrollableSearch>",
    );
  }
  return context;
};

const ScrollableSearchRoot: React.FC<IScrollableSearch> &
  React.FunctionComponent<IScrollableSearch> = memo<IScrollableSearch>(
  ({
    children,
  }: IScrollableSearch): React.ReactNode &
    React.JSX.Element &
    React.ReactNode => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollY = useSharedValue<number>(0);
    const pullDistance = useSharedValue<number>(0);
    const shouldAutoFocus = useSharedValue<boolean>(false);
    const onPullToFocusCallback = useRef<(() => void) | null>(null);

    const setIsFocusedWithDelay = <T extends boolean>(focused: T) => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
        dismissTimeoutRef.current = null;
      }

      if (!focused) {
        dismissTimeoutRef.current = setTimeout<[]>(() => {
          Keyboard.dismiss();
        }, 450);
      }

      setIsFocused(focused);
    };

    useEffect(() => {
      return () => {
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
        }
      };
    }, []);

    const value = useMemo<IScrollableSearchContext>(
      () => ({
        isFocused,
        setIsFocused: setIsFocusedWithDelay,
        scrollY,
        pullDistance,
        shouldAutoFocus,
        onPullToFocusCallback,
      }),
      [isFocused, scrollY, pullDistance, shouldAutoFocus],
    );

    return (
      <ScrollableSearchContext.Provider value={value}>
        <View style={styles.wrapper}>{children}</View>
      </ScrollableSearchContext.Provider>
    );
  },
);

const ScrollContent: React.FC<IScrollContent> &
  React.FunctionComponent<IScrollContent> = memo<IScrollContent>(
  ({
    children,
    pullThreshold = 80,
  }: IScrollContent): React.ReactNode & React.JSX.Element & React.ReactNode => {
    const {
      isFocused,
      scrollY,
      pullDistance,
      shouldAutoFocus,
      onPullToFocusCallback,
    } = useScrollableSearch();

    const triggerFocus = () => {
      if (onPullToFocusCallback.current) {
        onPullToFocusCallback.current();
      }
    };

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        const offsetY = event.contentOffset.y;
        scrollY.value = offsetY;

        if (offsetY < 0) {
          pullDistance.value = Math.abs(offsetY);

          if (pullDistance.value > pullThreshold && !shouldAutoFocus.value) {
            shouldAutoFocus.value = true;
            scheduleOnRN(triggerFocus);
          }
        } else {
          pullDistance.value = 0;
        }
      },
      onEndDrag: () => {
        "worklet";
        shouldAutoFocus.value = false;
      },
    });

    const animatedStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => {
      return {
        opacity: 1,
      };
    });

    return (
      <Animated.View
        style={[StyleSheet.absoluteFill, animatedStyle]}
        pointerEvents={isFocused ? "none" : "auto"}
      >
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={8}
          bounces={true}
        >
          {children}
        </Animated.ScrollView>
      </Animated.View>
    );
  },
);

const AnimatedComponent: React.FC<IAnimatedComponent> &
  React.FunctionComponent<IAnimatedComponent> = memo<IAnimatedComponent>(
  ({
    children,
    focusedOffset = -90,
    unfocusedOffset = 30,
    enablePullEffect = true,
    onPullToFocus,
    springConfig = {
      damping: 18,
      stiffness: 120,
      mass: 0.6,
    },
  }: IAnimatedComponent): React.ReactNode &
    React.JSX.Element &
    React.ReactNode => {
    const { isFocused, scrollY, pullDistance, onPullToFocusCallback } =
      useScrollableSearch();

    useEffect(() => {
      if (onPullToFocus) {
        onPullToFocusCallback.current = onPullToFocus;
      }
      return () => {
        onPullToFocusCallback.current = null;
      };
    }, [onPullToFocus, onPullToFocusCallback]);

    const animatedSearchStylez = useAnimatedStyle<
      Pick<ViewStyle, "transform" | "shadowOpacity">
    >(() => {
      const scale = enablePullEffect
        ? interpolate(
            pullDistance.value,
            [0, 60, 120],
            [1, 1.02, 1.05],
            Extrapolation.CLAMP,
          )
        : 1;

      const shadowOpacity = enablePullEffect
        ? interpolate(
            pullDistance.value,
            [0, 60],
            [0.05, 0.2],
            Extrapolation.CLAMP,
          )
        : 0.05;

      const translateY = interpolate(
        scrollY.value,
        [0, scrollY.value],
        [0, -scrollY.value],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ scale }, { translateY }],
        shadowOpacity,
      };
    });

    const animatedContainerStylez = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => {
      const baseOffset = isFocused ? focusedOffset : unfocusedOffset;

      const opacity = interpolate(
        scrollY.value,
        [0, 100],
        [1, 0],
        Extrapolation.CLAMP,
      );

      const translateY = withSpring(baseOffset, springConfig);

      return {
        transform: [{ translateY }],
        opacity,
      };
    }, [isFocused]);

    return (
      <Animated.View
        style={[styles.animatedContainer, animatedContainerStylez]}
      >
        <SafeAreaView edges={["top"]}>
          <Animated.View style={[animatedSearchStylez]}>
            {children}
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    );
  },
);

const Overlay: React.FC<IOverlay> & React.FunctionComponent<IOverlay> =
  memo<IOverlay>(
    ({
      children,
      onPress,
      enableBlur = true,
      blurTint = "dark",
      maxBlurIntensity = 80,
    }: IOverlay): React.ReactNode & React.JSX.Element & React.ReactNode => {
      const { isFocused, pullDistance, setIsFocused } = useScrollableSearch();

      const animatedBlurProps = useAnimatedProps(() => {
        if (isFocused) {
          return {
            intensity: withTiming(maxBlurIntensity, { duration: 350 }),
          };
        }

        if (pullDistance.value > 0) {
          return {
            intensity: interpolate(
              pullDistance.value,
              [0, 20, 80],
              [0, 30, maxBlurIntensity],
              Extrapolation.CLAMP,
            ),
          };
        }

        return {
          intensity: withTiming(0, { duration: 400 }),
        };
      }, [isFocused, maxBlurIntensity]);

      const animatedStyle = useAnimatedStyle(() => {
        if (isFocused) {
          return {
            opacity: withTiming(1, { duration: 350 }),
          };
        }
        const opacity = interpolate(
          pullDistance.value,
          [0, 10],
          [0, 1],
          Extrapolation.CLAMP,
        );
        return {
          opacity:
            pullDistance.value > 0 ? opacity : withTiming(0, { duration: 400 }),
        };
      }, [isFocused]);

      const handlePress = () => {
        if (isFocused) {
          setIsFocused(false);
        }
        onPress?.();
      };

      return (
        <Animated.View
          style={[styles.overlay, animatedStyle]}
          pointerEvents={isFocused ? "auto" : "none"}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handlePress}
          >
            {enableBlur ? (
              Platform.OS === "ios" ? (
                <AnimatedBlurView
                  style={StyleSheet.absoluteFill}
                  tint={blurTint}
                  animatedProps={animatedBlurProps}
                >
                  {children}
                </AnimatedBlurView>
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: "rgba(0,0,0,1)",
                    },
                  ]}
                >
                  {children}
                </View>
              )
            ) : (
              <Animated.View style={StyleSheet.absoluteFill}>
                {children}
              </Animated.View>
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    },
  );
const FocusedScreen: React.FC<IFocusedScreen> &
  React.FunctionComponent<IFocusedScreen> = memo<IFocusedScreen>(
  ({
    children,
  }: IFocusedScreen): React.ReactNode & React.JSX.Element & React.ReactNode => {
    const { isFocused } = useScrollableSearch();

    const animatedStylez = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isFocused ? 1 : 0, {
          duration: isFocused ? 350 : 400,
        }),
      };
    }, [isFocused]);

    return (
      <Animated.View
        style={[StyleSheet.absoluteFill, animatedStylez]}
        pointerEvents={isFocused ? "box-none" : "none"}
      >
        {children}
      </Animated.View>
    );
  },
);

const ScrollableSearch = Object.assign(
  memo<IScrollableSearch>(ScrollableSearchRoot),
  {
    ScrollContent,
    AnimatedComponent,
    Overlay,
    FocusedScreen,
  },
);

export { useScrollableSearch, ScrollableSearch };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 20,
  },
  animatedContainer: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});
