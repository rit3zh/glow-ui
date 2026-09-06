import { StyleSheet, View, ViewStyle } from "react-native";
import React, { memo, useMemo, type ReactElement } from "react";
import Animated, {
  useAnimatedStyle,
  interpolate,
  withSpring,
  useSharedValue,
  useAnimatedProps,
  Extrapolation,
  type WithSpringConfig,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  Directions,
  type FlingGesture,
  type ComposedGesture,
} from "react-native-gesture-handler";
import type {
  FlingCardConfig,
  FlingStackConfig,
  BaseItemType,
  FlingStackComponent,
  FlingCardComponent,
} from "./types";
import { BlurView, type BlurViewProps } from "expo-blur";

const SPRING_CONFIG: WithSpringConfig = {
  damping: 18,
  stiffness: 130,
  mass: 0.5,
  overshootClamping: false,
};

const BLUR_STEP = 2;

const STACK_OFFSET = 18;
const STACK_SCALE_STEP = 0.05;

const AnimatedBlurView = Animated.createAnimatedComponent(
  BlurView as React.ComponentType<BlurViewProps>,
);

const FlingCardInner = <T extends BaseItemType>({
  visibleCount,
  item,
  position,
  totalItems,
  animProgress,
  activeIndex,
  lastIndex,
  renderItem,
  cardWidth,
  cardHeight,
  cardContainerStyle,
  blurIntensity = 40,
  useBlur = true,
  tint,
}: FlingCardConfig<T>): React.ReactNode & React.JSX.Element & ReactElement => {
  const animatedCardStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => {
    const depth = position - animProgress.value;
    const back = Math.max(visibleCount - 1, 2);

    const translateY = interpolate(
      depth,
      [-1, 0, 1, back],
      [cardHeight * 1.25, 0, 0, -STACK_OFFSET * (back - 1)],
      Extrapolation.CLAMP,
    );
    const scaleValue = interpolate(
      depth,
      [-1, 0, 1, back],
      [1.06, 1, 1, 1 - STACK_SCALE_STEP * (back - 1)],
      Extrapolation.CLAMP,
    );
    const opacityValue = interpolate(
      depth,
      [-1, -0.35, 0, back, back + 0.65],
      [0, 1, 1, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale: scaleValue }],
      opacity: opacityValue,
    };
  });

  const swipeUpGesture = useMemo<FlingGesture>(
    () =>
      Gesture.Fling()
        .direction(Directions.UP)
        .onStart(() => {
          if (activeIndex.value !== 0) {
            activeIndex.value -= 1;
            lastIndex.value = activeIndex.value;
            animProgress.value = withSpring(activeIndex.value, SPRING_CONFIG);
          }
        }),
    [animProgress, activeIndex, lastIndex],
  );

  const swipeDownGesture = useMemo<FlingGesture>(
    () =>
      Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart(() => {
          if (activeIndex.value !== totalItems - 1) {
            activeIndex.value += 1;
            lastIndex.value = activeIndex.value;
            animProgress.value = withSpring(activeIndex.value, SPRING_CONFIG);
          }
        }),
    [animProgress, activeIndex, totalItems, lastIndex],
  );

  const combinedGestures = useMemo<ComposedGesture>(
    () => Gesture.Race(swipeUpGesture, swipeDownGesture),
    [swipeUpGesture, swipeDownGesture],
  );

  const animatedBlurViewPropz = useAnimatedProps<
    Pick<BlurViewProps, "intensity">
  >(() => {
    const depth = position - animProgress.value;
    const intensity = interpolate(
      depth,
      [-1, 0, 0.5],
      [blurIntensity, 0, blurIntensity],
      Extrapolation.CLAMP,
    );
    return {
      intensity: Math.round(intensity / BLUR_STEP) * BLUR_STEP,
    };
  });

  return (
    <GestureDetector gesture={combinedGestures}>
      <Animated.View
        style={[
          styles.cardBase,
          {
            zIndex: totalItems - position,
            width: cardWidth,
            height: cardHeight,
          },
          animatedCardStyle,
        ]}
        shouldRasterizeIOS
        renderToHardwareTextureAndroid
        collapsable={false}
      >
        <View style={[styles.cardClip, cardContainerStyle]}>
          {renderItem?.({ item, index: position })}
          {useBlur && (
            <AnimatedBlurView
              style={StyleSheet.absoluteFillObject}
              animatedProps={animatedBlurViewPropz}
              tint={tint}
            />
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const FlingCard = memo(FlingCardInner) as FlingCardComponent;

const FlingStackInner = <T extends BaseItemType>({
  data,
  renderItem,
  visibleCount = 4,
  cardWidth = 300,
  cardHeight = 300,
  cardContainerStyle,
  wrapperStyle,
  blurIntensity = 40,
  useBlur = true,
  tint = "systemThickMaterialLight",
}: FlingStackConfig<T>): React.ReactNode & React.JSX.Element & ReactElement => {
  const animProgress = useSharedValue<number>(0);
  const activeIndex = useSharedValue<number>(0);
  const lastIndex = useSharedValue<number>(0);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {data.map<React.JSX.Element>((item: T, idx: number) => (
        <FlingCard<T>
          key={item.id}
          visibleCount={visibleCount}
          blurIntensity={blurIntensity}
          useBlur={useBlur}
          item={item}
          position={idx}
          totalItems={data.length}
          animProgress={animProgress}
          activeIndex={activeIndex}
          lastIndex={lastIndex}
          renderItem={renderItem}
          cardWidth={cardWidth}
          tint={tint}
          cardHeight={cardHeight}
          cardContainerStyle={cardContainerStyle}
        />
      ))}
    </View>
  );
};

export const FlingStack = memo(FlingStackInner) as FlingStackComponent;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBase: {
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardClip: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
});
