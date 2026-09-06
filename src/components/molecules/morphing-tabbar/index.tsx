// @ts-check
import React, { useState, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  Platform,
} from "react-native";
import type {
  LayoutRectangle,
  ViewStyle,
  PressableProps,
  LayoutChangeEvent,
} from "react-native";
import {
  Canvas,
  RoundedRect,
  Group,
  Shadow,
  BackdropBlur,
  Fill,
  rect,
  rrect,
} from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import {
  AndroidHaptics,
  impactAsync,
  ImpactFeedbackStyle,
  performAndroidHapticsAsync,
} from "expo-haptics";

import { DEFAULT_DARK_THEME, DEFAULT_ITEMS, DEFAULT_LIGHT_THEME } from "./conf";
import {
  MorphicTabBarContext,
  MorphicTabSlotContext,
  useMorphicTabBar,
  useMorphicTabSlot,
} from "./context";
import type {
  IMorphicTabBarBackground,
  IMorphicTabBarContext,
  IMorphicTabBarLabel,
  IMorphicTabBarList,
  IMorphicTabBarRoot,
  IMorphicTabBarTrigger,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const ANIMATION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

const AnimatedPressable =
  Animated.createAnimatedComponent<PressableProps>(Pressable);

const MorphicTabBarBackground: React.FC<IMorphicTabBarBackground> &
  React.FunctionComponent<IMorphicTabBarBackground> =
  memo<IMorphicTabBarBackground>(
    ({
      width,
      height,
      borderRadius,
      theme,
      enableGlass,
      enableShadow,
    }: IMorphicTabBarBackground):
      | (React.ReactNode & React.JSX.Element & React.ReactElement)
      | null => {
      if (width === 0 || height === 0) return null;

      return (
        <Canvas style={[StyleSheet.absoluteFill, { width, height }]}>
          <Group>
            {enableGlass && (
              <>
                <BackdropBlur
                  blur={10}
                  clip={rrect(
                    rect(0, 0, width, height),
                    borderRadius,
                    borderRadius,
                  )}
                >
                  <Fill
                    color={theme.glassBackground || "rgba(255, 255, 255, 0.1)"}
                  />
                </BackdropBlur>
              </>
            )}

            {enableShadow && (
              <RoundedRect
                x={0}
                y={0}
                width={width}
                height={height}
                r={borderRadius}
                color="transparent"
              >
                <Shadow
                  dx={0}
                  dy={4}
                  blur={12}
                  color={theme.shadowColor || "rgba(0, 0, 0, 0.2)"}
                />
              </RoundedRect>
            )}
          </Group>
        </Canvas>
      );
    },
  );

const MorphicTabBarRoot: React.FC<IMorphicTabBarRoot> &
  React.FunctionComponent<IMorphicTabBarRoot> = ({
  children,
  items = DEFAULT_ITEMS,
  onTabChange,
  initialActiveIndex = 0,
  animationDuration = 300,
  borderRadius = 12,
  light = DEFAULT_LIGHT_THEME,
  dark = DEFAULT_DARK_THEME,
  enableGlass = false,
  enableShadow = true,
  containerStyle,
  textStyle,
}: IMorphicTabBarRoot): React.JSX.Element => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? dark : light;

  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  const animationProgress = useSharedValue<number>(1);
  const previousIndex = useSharedValue<number>(initialActiveIndex);

  const setActive = useCallback<(index: number, keyPath: string) => void>(
    (index: number, keyPath: string) => {
      if (index === activeIndex) return;

      previousIndex.value = activeIndex;
      animationProgress.value = 0;
      animationProgress.value = withTiming<number>(1, {
        duration: animationDuration,
        easing: ANIMATION_EASING,
      });

      setActiveIndex(index);

      if (Platform.OS === "ios") {
        impactAsync(ImpactFeedbackStyle.Soft);
      } else {
        performAndroidHapticsAsync(AndroidHaptics.Keyboard_Tap);
      }
      onTabChange?.<string, number>(keyPath, index);
    },
    [
      activeIndex,
      animationProgress,
      previousIndex,
      animationDuration,
      onTabChange,
    ],
  );

  const ctx = useMemo<IMorphicTabBarContext>(
    () => ({
      activeIndex,
      setActive,
      animationProgress,
      previousIndex,
      theme,
      borderRadius,
      enableGlass,
      enableShadow,
      textStyle,
    }),
    [
      activeIndex,
      setActive,
      animationProgress,
      previousIndex,
      theme,
      borderRadius,
      enableGlass,
      enableShadow,
      textStyle,
    ],
  );

  return (
    <MorphicTabBarContext.Provider value={ctx}>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.navWrapper}>
          {children ?? (
            <MorphicTabBarList>
              {items.map<React.JSX.Element>((item, index) => (
                <MorphicTabBarTrigger
                  key={`${item.keyPath}-${index}`}
                  value={item.keyPath}
                >
                  <MorphicTabBarLabel>{item.name}</MorphicTabBarLabel>
                </MorphicTabBarTrigger>
              ))}
            </MorphicTabBarList>
          )}
        </View>
      </View>
    </MorphicTabBarContext.Provider>
  );
};

const MorphicTabBarList: React.FC<IMorphicTabBarList> &
  React.FunctionComponent<IMorphicTabBarList> = ({
  children,
  style,
}: IMorphicTabBarList): React.JSX.Element => {
  const { theme, borderRadius, enableGlass, enableShadow } =
    useMorphicTabBar("MorphicTabBar.List");

  const [containerLayout, setContainerLayout] = useState<
    Pick<LayoutRectangle, "width" | "height">
  >({
    width: 0,
    height: 0,
  });

  const handleContainerLayout = useCallback<(event: LayoutChangeEvent) => void>(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setContainerLayout({ width, height });
    },
    [],
  );

  const slots = React.Children.toArray(children);
  const totalItems = slots.length;

  return (
    <View
      style={[styles.navContainer, { borderRadius }, style]}
      onLayout={handleContainerLayout}
    >
      <MorphicTabBarBackground
        width={containerLayout.width}
        height={containerLayout.height}
        borderRadius={borderRadius}
        theme={theme}
        enableGlass={enableGlass}
        enableShadow={enableShadow}
      />

      <View style={styles.tabsRow}>
        {slots.map<React.JSX.Element>((child, index) => (
          <MorphicTabSlotContext.Provider
            key={index}
            value={{ index, totalItems }}
          >
            {child}
          </MorphicTabSlotContext.Provider>
        ))}
      </View>
    </View>
  );
};

const MorphicTabBarTrigger: React.FC<IMorphicTabBarTrigger> &
  React.FunctionComponent<IMorphicTabBarTrigger> = ({
  children,
  value,
  style,
}: IMorphicTabBarTrigger): React.JSX.Element => {
  const {
    activeIndex,
    setActive,
    animationProgress,
    previousIndex,
    theme,
    borderRadius,
  } = useMorphicTabBar("MorphicTabBar.Trigger");
  const { index, totalItems } = useMorphicTabSlot();

  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  const animatedContainerStylez = useAnimatedStyle<
    Pick<
      ViewStyle,
      | "borderTopLeftRadius"
      | "borderBottomLeftRadius"
      | "borderTopRightRadius"
      | "borderBottomRightRadius"
      | "marginHorizontal"
    >
  >(() => {
    const progress = animationProgress.value;
    const prevIdx = previousIndex.value;

    const wasActive = prevIdx === index;
    const willBeActive = activeIndex === index;

    let leftRadius: number;
    if (willBeActive) {
      const fromRadius = wasActive
        ? borderRadius
        : prevIdx === index - 1 || isFirst
          ? borderRadius
          : 0;
      leftRadius = interpolate(progress, [0, 1], [fromRadius, borderRadius]);
    } else if (wasActive) {
      const toRadius = activeIndex === index - 1 || isFirst ? borderRadius : 0;
      leftRadius = interpolate(progress, [0, 1], [borderRadius, toRadius]);
    } else {
      const shouldBeRounded = activeIndex === index - 1 || isFirst;
      const wasRounded = prevIdx === index - 1 || isFirst;
      if (shouldBeRounded !== wasRounded) {
        leftRadius = interpolate(
          progress,
          [0, 1],
          [wasRounded ? borderRadius : 0, shouldBeRounded ? borderRadius : 0],
        );
      } else {
        leftRadius = shouldBeRounded ? borderRadius : 0;
      }
    }
    let rightRadius: number;
    if (willBeActive) {
      const fromRadius = wasActive
        ? borderRadius
        : prevIdx === index + 1 || isLast
          ? borderRadius
          : 0;
      rightRadius = interpolate(progress, [0, 1], [fromRadius, borderRadius]);
    } else if (wasActive) {
      const toRadius = activeIndex === index + 1 || isLast ? borderRadius : 0;
      rightRadius = interpolate(progress, [0, 1], [borderRadius, toRadius]);
    } else {
      const shouldBeRounded = activeIndex === index + 1 || isLast;
      const wasRounded = prevIdx === index + 1 || isLast;
      if (shouldBeRounded !== wasRounded) {
        rightRadius = interpolate(
          progress,
          [0, 1],
          [wasRounded ? borderRadius : 0, shouldBeRounded ? borderRadius : 0],
        );
      } else {
        rightRadius = shouldBeRounded ? borderRadius : 0;
      }
    }

    let marginH: number;
    if (willBeActive && !wasActive) {
      marginH = interpolate(progress, [0, 1], [0, 8]);
    } else if (wasActive && !willBeActive) {
      marginH = interpolate(progress, [0, 1], [8, 0]);
    } else if (willBeActive && wasActive) {
      marginH = 8;
    } else {
      marginH = 0;
    }

    return {
      borderTopLeftRadius: leftRadius,
      borderBottomLeftRadius: leftRadius,
      borderTopRightRadius: rightRadius,
      borderBottomRightRadius: rightRadius,
      marginHorizontal: marginH,
    };
  }, [activeIndex, borderRadius, index, isFirst, isLast]);

  const scaleValue = useSharedValue<number>(1);

  const handlePressIn = useCallback<() => void>(() => {
    scaleValue.value = withTiming(0.95, { duration: 100 });
  }, [scaleValue]);

  const handlePressOut = useCallback<() => void>(() => {
    scaleValue.value = withTiming<number>(1, { duration: 100 });
  }, [scaleValue]);

  const animatedScaleStylez = useAnimatedStyle<Pick<ViewStyle, "transform">>(
    () => ({
      transform: [{ scale: scaleValue.value }],
    }),
  );

  const handleOnPress: () => void = () => {
    return setActive(index, value);
  };

  return (
    <AnimatedPressable
      onPress={handleOnPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.tab,
        { backgroundColor: theme.tabBackground },
        animatedContainerStylez,
        animatedScaleStylez,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
};

const MorphicTabBarLabel: React.FC<IMorphicTabBarLabel> &
  React.FunctionComponent<IMorphicTabBarLabel> = ({
  children,
  style,
}: IMorphicTabBarLabel): React.JSX.Element => {
  const { activeIndex, theme, textStyle } =
    useMorphicTabBar("MorphicTabBar.Label");
  const { index } = useMorphicTabSlot();
  const isActive = index === activeIndex;

  return (
    <Text
      style={[
        styles.tabText,
        {
          color: isActive ? theme.activeText : theme.inactiveText,
          fontWeight: isActive ? "600" : "400",
        },
        textStyle,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  navContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 14,
  },
});

const MorphicTabBar = createCompoundComponent(
  "MorphicTabBar",
  memo(MorphicTabBarRoot),
  {
    List: createCompoundComponent("MorphicTabBar.List", MorphicTabBarList),
    Trigger: createCompoundComponent(
      "MorphicTabBar.Trigger",
      MorphicTabBarTrigger,
    ),
    Label: createCompoundComponent("MorphicTabBar.Label", MorphicTabBarLabel),
    Background: createCompoundComponent(
      "MorphicTabBar.Background",
      MorphicTabBarBackground,
    ),
  },
);

export {
  MorphicTabBar,
  MorphicTabBarRoot,
  MorphicTabBarList,
  MorphicTabBarTrigger,
  MorphicTabBarLabel,
  MorphicTabBarBackground,
};
export type {
  IMorphicTabBarRoot,
  IMorphicTabBarList,
  IMorphicTabBarTrigger,
  IMorphicTabBarLabel,
  IMorphicTabBarBackground,
  ITabItem,
  ITabBar,
} from "./types";
export default MorphicTabBar;
