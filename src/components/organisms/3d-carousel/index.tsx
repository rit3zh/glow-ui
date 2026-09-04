import React, { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { FLING_PROJECTION, SNAP_SPRING, SPIN_DECAY } from "./conf";
import {
  CONTAINER_PADDING,
  DEFAULT_BACK_OPACITY,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_DRAG_SENSITIVITY,
  DEFAULT_GAP,
  DEFAULT_ITEM_ASPECT,
  DEFAULT_PERSPECTIVE_FACTOR,
  DEFAULT_RADIUS_RATIO,
  IMAGE_FADE_IN_DURATION,
  IMAGE_FADE_IN_SCALE,
} from "./const";
import {
  degreesPerPixel,
  faceAngle,
  frontIndex,
  projectFace,
  radiusOf,
  rotationForIndex,
  snapRotation,
  stepOf,
  tiledFaceWidth,
} from "./helper";
import type {
  ICarousel3D,
  ICarousel3DFace,
  ICarousel3DImage,
} from "./types";

const CarouselImage: React.FC<ICarousel3DImage> = ({
  uri,
  width,
  height,
  borderRadius,
}) => {
  const progress = useSharedValue<number>(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [IMAGE_FADE_IN_SCALE, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const handleLoad = useCallback(() => {
    progress.value = withTiming(1, { duration: IMAGE_FADE_IN_DURATION });
  }, [progress]);

  return (
    <Animated.Image
      source={{ uri }}
      onLoad={handleLoad}
      resizeMode="cover"
      style={[{ width, height, borderRadius }, animatedStyle]}
    />
  );
};

const Carousel3DImage = memo(CarouselImage);

const CarouselFace: React.FC<ICarousel3DFace> = ({
  index,
  rotation,
  step,
  radius,
  perspective,
  itemWidth,
  itemHeight,
  backOpacity,
  borderRadius,
  onPress,
  children,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const angle = faceAngle(index, rotation.value, step);
    const { matrix, depth, scale } = projectFace(angle, radius, perspective);

    return {
      opacity: interpolate(
        depth,
        [-radius, radius],
        [backOpacity, 1],
        Extrapolation.CLAMP,
      ),

      zIndex: Math.round(scale * 100),
      transform: [{ matrix }],
    };
  }, [index, step, radius, perspective, backOpacity]);

  const handlePress = useCallback(() => onPress?.(index), [onPress, index]);

  return (
    <Animated.View
      style={[
        styles.face,
        { width: itemWidth, height: itemHeight, borderRadius },
        animatedStyle,
      ]}
    >
      {onPress ? (
        <Pressable onPress={handlePress} style={styles.fill}>
          {children}
        </Pressable>
      ) : (
        children
      )}
    </Animated.View>
  );
};

const Carousel3DFace = memo(CarouselFace);

const Carousel3D = <ItemT,>({
  data,
  imageExtractor,
  renderItem,
  keyExtractor,
  itemWidth: itemWidthProp,
  itemHeight: itemHeightProp,
  gap = DEFAULT_GAP,
  radius: radiusProp,
  cylinderWidth,
  perspectiveFactor = DEFAULT_PERSPECTIVE_FACTOR,
  height,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  snap = true,
  initialIndex = 0,
  backOpacity = DEFAULT_BACK_OPACITY,
  borderRadius = DEFAULT_BORDER_RADIUS,
  onIndexChange,
  onPressItem,
  style,
}: ICarousel3D<ItemT>) => {
  const { width: windowWidth } = useWindowDimensions();

  const faceCount = data.length;

  const radius =
    radiusProp ??
    (cylinderWidth !== undefined
      ? radiusOf(cylinderWidth)
      : itemWidthProp !== undefined
        ? radiusOf(faceCount * (itemWidthProp + gap))
        : windowWidth * DEFAULT_RADIUS_RATIO);

  const itemWidth = itemWidthProp ?? tiledFaceWidth(radius, faceCount, gap);
  const itemHeight = itemHeightProp ?? itemWidth * DEFAULT_ITEM_ASPECT;

  const geometry = useMemo(
    () => ({
      radius,
      step: stepOf(faceCount),
      perspective: radius * perspectiveFactor,
      degreesPerPixel: degreesPerPixel(radius) * dragSensitivity,
    }),
    [radius, faceCount, perspectiveFactor, dragSensitivity],
  );

  const rotation = useSharedValue<number>(
    rotationForIndex(initialIndex, stepOf(faceCount)),
  );
  const dragOrigin = useSharedValue<number>(0);

  const resolveUri = useCallback(
    (item: ItemT, index: number): string | null => {
      if (imageExtractor) return imageExtractor(item, index);
      return typeof item === "string" ? item : null;
    },
    [imageExtractor],
  );

  const handleIndexChange = useCallback(
    (index: number) => onIndexChange?.(index),
    [onIndexChange],
  );

  useAnimatedReaction(
    () => frontIndex(rotation.value, geometry.step, faceCount),
    (current, previous) => {
      if (previous !== null && current !== previous) {
        scheduleOnRN(handleIndexChange, current);
      }
    },
    [geometry.step, faceCount, handleIndexChange],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-8, 8])
        .onBegin(() => {
          cancelAnimation(rotation);
          dragOrigin.value = rotation.value;
        })
        .onUpdate((event) => {
          rotation.value =
            dragOrigin.value + event.translationX * geometry.degreesPerPixel;
        })
        .onEnd((event) => {
          const velocity = event.velocityX * geometry.degreesPerPixel;

          if (!snap) {
            rotation.value = withDecay({ velocity, ...SPIN_DECAY });
            return;
          }

          const projected = rotation.value + velocity * FLING_PROJECTION;
          rotation.value = withSpring(snapRotation(projected, geometry.step), {
            ...SNAP_SPRING,
            velocity,
          });
        }),
    [geometry.degreesPerPixel, geometry.step, snap, rotation, dragOrigin],
  );

  const handlePressFace = useCallback(
    (index: number) => {
      const item = data[index];
      if (item === undefined) return;

      const angle = faceAngle(index, rotation.value, geometry.step);
      const { facing } = projectFace(
        angle,
        geometry.radius,
        geometry.perspective,
      );

      if (facing <= 0) return;

      onPressItem?.(item, index);
    },
    [
      data,
      geometry.step,
      geometry.radius,
      geometry.perspective,
      onPressItem,
      rotation,
    ],
  );

  const frontScale = perspectiveFactor / Math.max(perspectiveFactor - 1, 0.1);
  const containerHeight =
    height ?? itemHeight * frontScale + CONTAINER_PADDING * 2;

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.container, { height: containerHeight }, style]}>
        {data.map((item, index) => (
          <Carousel3DFace
            key={keyExtractor?.(item, index) ?? `face-${index}`}
            index={index}
            rotation={rotation}
            step={geometry.step}
            radius={geometry.radius}
            perspective={geometry.perspective}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            backOpacity={backOpacity}
            borderRadius={borderRadius}
            onPress={onPressItem ? handlePressFace : undefined}
          >
            {renderItem ? (
              renderItem({ item, index })
            ) : (
              <Carousel3DImage
                uri={resolveUri(item, index) ?? ""}
                width={itemWidth}
                height={itemHeight}
                borderRadius={borderRadius}
              />
            )}
          </Carousel3DFace>
        ))}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  face: {
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  fill: {
    flex: 1,
  },
});

export {
  Carousel3D,
  Carousel3DFace,
  Carousel3DImage,
};
export type {
  ICarousel3D,
  ICarousel3DFace,
  ICarousel3DImage,
};

export default memo(Carousel3D) as typeof Carousel3D;
