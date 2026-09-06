import { BlurView, BlurViewProps } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { easeGradient } from "react-native-easing-gradient";
import { Colors, HEADER_HEIGHT, MAX_BLUR_INTENSITY, spacing } from "./conf";
import type { AnimatedHeaderProps } from "./types";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

export const AnimatedHeaderScrollView: React.FC<AnimatedHeaderProps> &
  React.FunctionComponent<AnimatedHeaderProps> = memo<AnimatedHeaderProps>(
  ({
    largeTitle,
    subtitle,
    children,
    rightComponent,
    showsVerticalScrollIndicator = false,
    contentContainerStyle,
    headerBackgroundGradient = {
      colors: ["rgba(0, 0, 0, 0.85)", "rgba(0, 0, 0, 0.8)", "transparent"],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    },
    headerBlurConfig = {
      intensity: 10,
      tint: Platform.OS === "ios" ? "systemThickMaterialDark" : "dark",
    },
    smallTitleBlurIntensity = 90,
    smallTitleBlurTint = "dark",
    maskGradientColors = {
      start: "transparent",
      middle: "rgba(0,0,0,0.99)",
      end: "black",
    },
    largeTitleBlurIntensity = 20,
    largeHeaderTitleStyle: _largeTitleStyle = { fontSize: 40 },
    largeHeaderSubtitleStyle,
    smallHeaderSubtitleStyle: _smallHeaderSubtitleStylez,
    smallHeaderTitleStyle,
  }: AnimatedHeaderProps):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const scrollY = useSharedValue<number>(0);
    const insets = useSafeAreaInsets();

    const onScroll = useAnimatedScrollHandler<Record<string, unknown>>({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const animatedLargeTitleStylez = useAnimatedStyle<
      Partial<Pick<TextStyle, "fontSize">>
    >(() => {
      const __largeTitleProps__: any = _largeTitleStyle || {};
      const fontSizeValue = __largeTitleProps__["fontSize"];

      const fontSize = interpolate(
        -scrollY.value,
        [0, 100],
        [fontSizeValue, fontSizeValue * 1],
        Extrapolation.CLAMP,
      );
      return {
        fontSize,
      };
    });

    const largeTitleStyle = useAnimatedStyle<
      Partial<Pick<TextStyle, "opacity">>
    >(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, 60],
        [1, 0],
        Extrapolation.CLAMP,
      );

      return {
        opacity,
      };
    });

    const smallHeaderStyle = useAnimatedStyle<
      Partial<Pick<TextStyle, "opacity">>
    >(() => {
      const opacity = withTiming<number>(
        interpolate(scrollY.value, [40, 80], [0, 1], Extrapolation.CLAMP),
        {
          duration: 600,
        },
      );

      const translateY = withTiming<number>(
        interpolate(scrollY.value, [40, 80], [20, 0], Extrapolation.CLAMP),
        {
          duration: 600,
        },
      );

      return {
        opacity,
        transform: [{ translateY }],
      };
    });

    const smallHeaderSubtitleStyle = useAnimatedStyle<
      Partial<Pick<TextStyle, "opacity">>
    >(() => {
      const shouldShow = scrollY.value > 100;

      return {
        opacity: withSpring<number>(shouldShow ? 0.5 : 0, {
          damping: 18,
          stiffness: 120,
          mass: 1.2,
        }),
        transform: [
          {
            translateY: withTiming<number>(shouldShow ? 0 : 10, {
              duration: 900,
            }),
          },
        ],
      };
    });

    const headerBackgroundStylez = useAnimatedStyle<
      Partial<Pick<ViewStyle, "opacity">>
    >(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, 80],
        [0, 1],
        Extrapolation.CLAMP,
      );

      return {
        opacity,
      };
    });

    const animatedHeaderBlur = useAnimatedProps(() => {
      const intensity = interpolate(
        scrollY.value,
        [0, 100],
        [0, MAX_BLUR_INTENSITY],
        Extrapolation.CLAMP,
      );

      return {
        intensity,
      } as any;
    });

    const largeTitleBlur = useAnimatedProps(() => {
      const intensity = interpolate(
        scrollY.value,
        [0, 80],
        [largeTitleBlurIntensity, 0],
        Extrapolation.CLAMP,
      );

      return {
        intensity,
      } as any;
    });

    const smallTitleBlur = useAnimatedProps<
      Partial<Pick<BlurViewProps, "intensity">>
    >(() => {
      const intensity = interpolate(
        scrollY.value,
        [0, 80, 100],
        [0, 15, 0],
        Extrapolation.CLAMP,
      );

      const _intensity =
        scrollY.value < 30
          ? withTiming<number>(0, { duration: 900 })
          : intensity;

      return {
        intensity: _intensity,
      } as any;
    });

    const { colors: maskColors, locations: maskLocations } = easeGradient({
      colorStops: {
        0: { color: maskGradientColors.start },
        0.5: { color: maskGradientColors.middle },
        1: { color: maskGradientColors.end },
      },
      extraColorStopsPerTransition: 20,
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.headerBackgroundContainer,
            {
              height: HEADER_HEIGHT + insets.top + 50,
            },
            headerBackgroundStylez,
          ]}
        >
          {Platform.OS !== "web" ? (
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={maskLocations as any}
                  colors={maskColors as any}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                />
              }
              style={[StyleSheet.absoluteFill]}
            >
              <LinearGradient
                colors={headerBackgroundGradient.colors as any}
                locations={headerBackgroundGradient.locations}
                start={headerBackgroundGradient.start}
                end={headerBackgroundGradient.end}
                style={StyleSheet.absoluteFill}
              />
              <BlurView
                intensity={headerBlurConfig.intensity}
                tint={headerBlurConfig.tint as any}
                style={[StyleSheet.absoluteFill]}
              />
            </MaskedView>
          ) : (
            <Animated.View
              style={[StyleSheet.absoluteFill, styles.webHeaderBackground]}
            />
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.fixedHeader,
            {
              paddingTop: insets.top,
              height: HEADER_HEIGHT + insets.top,
            },
            smallHeaderStyle,
          ]}
        >
          <View style={styles.fixedHeaderContent}>
            <View style={styles.fixedHeaderTextContainer}>
              <Animated.Text
                style={[styles.smallHeaderTitle, smallHeaderTitleStyle]}
              >
                {largeTitle}
              </Animated.Text>
              {subtitle && (
                <Animated.Text
                  style={[
                    styles.smallHeaderSubtitle,
                    smallHeaderSubtitleStyle,
                    _smallHeaderSubtitleStylez,
                  ]}
                >
                  {subtitle}
                </Animated.Text>
              )}
            </View>

            <MaskedView
              maskElement={
                <LinearGradient
                  locations={maskLocations as any}
                  colors={maskColors as any}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                />
              }
              style={[StyleSheet.absoluteFill]}
            >
              <LinearGradient
                colors={["transparent", "transparent"]}
                style={StyleSheet.absoluteFill}
              />
              <AnimatedBlurView
                animatedProps={smallTitleBlur}
                intensity={smallTitleBlurIntensity}
                tint={smallTitleBlurTint}
                style={[
                  styles.smallTitleBlurOverlay,
                  {
                    height: HEADER_HEIGHT + insets.top + 20,
                  },
                ]}
              />
            </MaskedView>

            {rightComponent && (
              <View style={styles.rightComponentContainer}>
                {rightComponent}
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={[
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: insets.bottom + spacing.xl,
            },
            contentContainerStyle,
          ]}
        >
          <Animated.View style={[styles.largeTitleContainer, largeTitleStyle]}>
            <View style={styles.largeTitleTextContainer}>
              <Animated.Text
                style={[
                  styles.largeTitle,
                  _largeTitleStyle,
                  animatedLargeTitleStylez,
                ]}
              >
                {largeTitle}
              </Animated.Text>
              {subtitle && (
                <Text style={[styles.largeSubtitle, largeHeaderSubtitleStyle]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </Animated.View>

          <View style={styles.content}>{children}</View>
        </Animated.ScrollView>
      </View>
    );
  },
);

export default memo<
  React.FC<AnimatedHeaderProps> & React.FunctionComponent<AnimatedHeaderProps>
>(AnimatedHeaderScrollView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  headerBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  webHeaderBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  smallTitleBlurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    justifyContent: "flex-end",
  },
  fixedHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  fixedHeaderTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  smallHeaderTitle: {
    fontSize: 24,
    color: Colors.white,
    textAlign: "center",
  },
  smallHeaderSubtitle: {
    fontSize: 12,
    color: Colors.gray[400],
    textAlign: "center",
  },
  rightComponentContainer: {
    marginLeft: spacing.md,
  },
  largeTitleContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  largeTitleTextContainer: {},
  backgroundImageContainer: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: 200,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.52)",
  },
  largeTitleContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: "flex-end",
    flex: 1,
  },
  largeTitle: {
    fontSize: 40,
    color: Colors.white,
    letterSpacing: -0.5,
    paddingTop: 5,
  },
  largeSubtitle: {
    fontSize: 18,
    color: Colors.gray[400],
    marginTop: spacing.xs,
    paddingTop: 5,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  largeTitleBlurContainer: {
    backgroundColor: "transparent",
  },
});
