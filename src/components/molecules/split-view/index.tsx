// @ts-check
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  DEFAULT_GAP,
  DEFAULT_INITIAL_TOP_HEIGHT,
  DEFAULT_MIN_BOTTOM_HEIGHT,
  DEFAULT_MIN_TOP_HEIGHT,
  DEFAULT_SPRING,
  DEFAULT_VELOCITY_THRESHOLD,
  HANDLE_HIT_SLOP,
  THEME,
} from "./const";
import { SplitViewContext, useSplitView } from "./context";
import { clamp, resolveSnapTarget } from "./helpers";
import type {
  ISplitViewHandle,
  ISplitViewPane,
  ISplitViewRoot,
  ISplitViewTitle,
} from "./types";
import { scheduleOnRN } from "react-native-worklets";
import { createCompoundComponent } from "@/utils/create-compound-component";

const SplitViewRoot: React.FC<ISplitViewRoot> &
  React.FunctionComponent<ISplitViewRoot> = ({
  children,
  initialTopHeight = DEFAULT_INITIAL_TOP_HEIGHT,
  minTopHeight = DEFAULT_MIN_TOP_HEIGHT,
  minBottomHeight = DEFAULT_MIN_BOTTOM_HEIGHT,
  maxTopHeight,
  gap = DEFAULT_GAP,
  snapPoints,
  velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
  springConfig = DEFAULT_SPRING,
  onHeightChange,
  style,
}: ISplitViewRoot): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const topHeight = useSharedValue<number>(initialTopHeight);
  const startY = useSharedValue<number>(0);
  const handleScale = useSharedValue<number>(1);

  const minTop = minTopHeight;
  const maxTop =
    maxTopHeight ??
    Math.max(minTop + 1, containerHeight - gap - minBottomHeight);

  const resolvedSnapPoints = useMemo<number[]>(() => {
    if (snapPoints && snapPoints.length > 0) {
      return [...snapPoints].sort((a, b) => a - b);
    }
    return [minTop, (minTop + maxTop) / 2, maxTop];
  }, [snapPoints, minTop, maxTop]);

  useEffect(() => {
    if (containerHeight <= 0) return;
    const bounded = Math.min(Math.max(topHeight.value, minTop), maxTop);
    if (bounded !== topHeight.value) {
      topHeight.value = withSpring(bounded, springConfig);
    }
  }, [containerHeight, minTop, maxTop]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .hitSlop({ top: HANDLE_HIT_SLOP, bottom: HANDLE_HIT_SLOP })
        .onStart(() => {
          startY.value = topHeight.value;
          handleScale.value = withSpring(1.18, springConfig);
        })
        .onUpdate((e) => {
          topHeight.value = clamp(
            startY.value + e.translationY,
            minTop,
            maxTop,
          );
        })
        .onEnd((e) => {
          const velocity = clamp(e.velocityY, -4000, 4000);
          const target = resolveSnapTarget(
            topHeight.value,
            velocity,
            resolvedSnapPoints,
            velocityThreshold,
          );
          topHeight.value = withSpring(target, {
            ...springConfig,
            overshootClamping: true,
          });
          if (onHeightChange) scheduleOnRN(onHeightChange, target);
        })
        .onFinalize(() => {
          handleScale.value = withSpring(1, springConfig);
        }),
    [
      minTop,
      maxTop,
      resolvedSnapPoints,
      velocityThreshold,
      springConfig,
      onHeightChange,
      topHeight,
      startY,
      handleScale,
    ],
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);

  const ctx = useMemo(
    () => ({ topHeight, handleScale, gap, minTop, maxTop, gesture }),
    [topHeight, handleScale, gap, minTop, maxTop, gesture],
  );

  return (
    <SplitViewContext.Provider value={ctx}>
      <GestureHandlerRootView style={[styles.root, style]} onLayout={onLayout}>
        {children}
      </GestureHandlerRootView>
    </SplitViewContext.Provider>
  );
};

const SplitViewTop: React.FC<ISplitViewPane> = ({
  children,
  style,
}: ISplitViewPane): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const { topHeight, minTop } = useSplitView("SplitView.Top");

  const animatedStyle = useAnimatedStyle<Pick<ViewStyle, "height" | "opacity">>(
    () => ({
      height: topHeight.value,
      opacity: interpolate(
        topHeight.value,
        [minTop, minTop + 60],
        [0.2, 1],
        Extrapolation.CLAMP,
      ),
    }),
  );

  return (
    <Animated.View style={[styles.pane, styles.top, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

const SplitViewHandle: React.FC<ISplitViewHandle> &
  React.FunctionComponent<ISplitViewHandle> = ({
  color,
  style,
  barStyle,
}: ISplitViewHandle): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const { gesture, handleScale, gap } = useSplitView("SplitView.Handle");

  const barAnimatedStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(
    () => ({
      transform: [{ scale: handleScale.value }],
    }),
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.handle, { height: gap }, style]}>
        <Animated.View
          style={[
            styles.handleBar,
            { backgroundColor: color ?? THEME.handle },
            barAnimatedStyle,
            barStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const SplitViewBottom: React.FC<ISplitViewPane> = ({
  children,
  style,
}: ISplitViewPane): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const { topHeight, maxTop } = useSplitView("SplitView.Bottom");

  const animatedStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: interpolate(
      topHeight.value,
      [maxTop - 60, maxTop],
      [1, 0.2],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[styles.pane, styles.bottom, styles.flex, animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
};

const SplitViewTitle: React.FC<ISplitViewTitle> = ({
  children,
  style,
}: ISplitViewTitle): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => <Text style={[styles.title, style]}>{children}</Text>;

const SplitView = Object.assign(SplitViewRoot, {
  Root: SplitViewRoot,
  Top: SplitViewTop,
  Handle: SplitViewHandle,
  Bottom: SplitViewBottom,
  Title: SplitViewTitle,
});

const Root = createCompoundComponent("Root", SplitViewRoot);
const Top = createCompoundComponent("Top", SplitViewTop);
const Bottom = createCompoundComponent("Bottom", SplitViewBottom);
const Handle = createCompoundComponent("Handle", SplitViewHandle);
const Title = createCompoundComponent("Title", SplitViewTitle);

export {
  SplitView,
  SplitViewRoot,
  SplitViewTop,
  SplitViewHandle,
  SplitViewBottom,
  SplitViewTitle,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.container,
  },
  flex: {
    flex: 1,
  },
  pane: {
    overflow: "hidden",
    backgroundColor: THEME.section,
  },
  top: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bottom: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.title,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
});
