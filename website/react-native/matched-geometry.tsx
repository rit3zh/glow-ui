import React, { useRef, useState, useCallback, memo } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  type ViewStyle,
  Platform,
} from "react-native";
import type { LayoutMeasurement, IMatchedGeometry } from "./types";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { scheduleOnRN } from "react-native-worklets";
import {
  ANIMATION_CONFIG,
  DISMISS_THRESHOLD,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "./conf";

export const MatchedGeometry: React.FC<IMatchedGeometry> &
  React.FunctionComponent<IMatchedGeometry> = memo<IMatchedGeometry>(
  ({
    id,
    children,
    onPress,
  }: IMatchedGeometry):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const viewRef = useRef<View>(null);

    const layoutRef = useRef<LayoutMeasurement | null>(null);

    const [layoutReady, setLayoutReady] = useState<boolean>(false);

    const translateX = useSharedValue<number>(0);
    const translateY = useSharedValue<number>(0);
    const scale = useSharedValue<number>(1);
    const opacity = useSharedValue<number>(0);

    const gestureTranslateX = useSharedValue<number>(0);
    const gestureTranslateY = useSharedValue<number>(0);

    const sourceOpacity = useSharedValue<number>(1);
    const contentOpacity = useSharedValue<number>(0);

    const layoutX = useSharedValue<number>(0);
    const layoutY = useSharedValue<number>(0);
    const layoutWidth = useSharedValue<number>(0);
    const layoutHeight = useSharedValue<number>(0);

    const resetAnimatedValues = useCallback(() => {
      "worklet";
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 0;
      gestureTranslateX.value = 0;
      gestureTranslateY.value = 0;
      contentOpacity.value = 0;
    }, []);

    const handlePress = useCallback(() => {
      if (isAnimating || isExpanded) return;

      setIsAnimating(true);

      resetAnimatedValues();

      if (viewRef.current) {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          layoutRef.current = { x, y, width, height, pageX, pageY };

          layoutX.value = pageX;
          layoutY.value = pageY;
          layoutWidth.value = width;
          layoutHeight.value = height;

          requestAnimationFrame(() => {
            setLayoutReady(true);
            setIsExpanded(true);
          });
        });
      }

      sourceOpacity.value = withTiming<number>(0, { duration: 300 });
      onPress?.();
    }, [isAnimating, isExpanded, sourceOpacity, onPress]);

    const animateToCenter = useCallback(() => {
      const layout = layoutRef.current;
      if (!layout) return;

      const centerX = SCREEN_WIDTH / 2;
      const centerY = SCREEN_HEIGHT / 2;
      const currentCenterX = layout.pageX + layout.width / 2;
      const currentCenterY = layout.pageY + layout.height / 2;
      const deltaX = centerX - currentCenterX;
      const deltaY = centerY - currentCenterY;

      const targetScale = Math.min(
        (SCREEN_WIDTH * 0.8) / layout.width,
        (SCREEN_HEIGHT * 0.6) / layout.height,
      );

      contentOpacity.value = withTiming<number>(1, { duration: 200 });

      opacity.value = withTiming<number>(1, ANIMATION_CONFIG);
      translateX.value = withTiming<number>(deltaX, ANIMATION_CONFIG);
      translateY.value = withTiming<number>(deltaY, ANIMATION_CONFIG);
      scale.value = withTiming<number>(targetScale, ANIMATION_CONFIG, () => {
        scheduleOnRN<[boolean], void>(setIsAnimating, false);
      });
    }, [translateX, translateY, scale, opacity, contentOpacity]);

    const animateToOriginal = useCallback(() => {
      setIsAnimating(true);

      gestureTranslateX.value = withTiming<number>(0, ANIMATION_CONFIG);
      gestureTranslateY.value = withTiming<number>(0, ANIMATION_CONFIG);
      opacity.value = withTiming<number>(0, ANIMATION_CONFIG);
      translateX.value = withTiming<number>(0, ANIMATION_CONFIG);
      translateY.value = withTiming<number>(0, ANIMATION_CONFIG);
      scale.value = withTiming<number>(1, ANIMATION_CONFIG, (finished) => {
        if (finished) {
          contentOpacity.value = 0;
          scheduleOnRN(setIsExpanded, false);
          scheduleOnRN(setIsAnimating, false);
          scheduleOnRN(setLayoutReady, false);
        }
      });

      sourceOpacity.value = withTiming<number>(1, {
        duration: 500,
        easing: Easing.bezier(0.33, 0.01, 0, 1),
      });
    }, [
      translateX,
      translateY,
      scale,
      opacity,
      gestureTranslateX,
      gestureTranslateY,
      sourceOpacity,
      contentOpacity,
    ]);

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        gestureTranslateX.value = event.translationX;
        gestureTranslateY.value = event.translationY;

        const distance = Math.sqrt(
          Math.pow(event.translationX, 2) + Math.pow(event.translationY, 2),
        );
        const maxDistance = 300;
        const opacityFactor = Math.max(0.3, 1 - distance / maxDistance);
        opacity.value = opacityFactor;
      })
      .onEnd((event) => {
        const distance = Math.sqrt(
          Math.pow(event.translationX, 2) + Math.pow(event.translationY, 2),
        );

        if (distance > DISMISS_THRESHOLD) {
          scheduleOnRN(animateToOriginal);
        } else {
          gestureTranslateX.value = withTiming<number>(0, ANIMATION_CONFIG);
          gestureTranslateY.value = withTiming<number>(0, ANIMATION_CONFIG);
          opacity.value = withTiming<number>(1, ANIMATION_CONFIG);
        }
      });

    React.useEffect(() => {
      if (isExpanded && layoutReady) {
        animateToCenter();
      }
    }, [isExpanded, layoutReady, animateToCenter]);

    const handleLayout = useCallback(() => {
      if (viewRef.current) {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          layoutRef.current = { x, y, width, height, pageX, pageY };
        });
      }
    }, []);

    const animatedModalStyle = useAnimatedStyle<
      Pick<
        ViewStyle,
        | "position"
        | "left"
        | "top"
        | "width"
        | "height"
        | "opacity"
        | "transform"
      >
    >(() => {
      return {
        position: "absolute",
        left: layoutX.value,
        top: layoutY.value,
        width: layoutWidth.value,
        height: layoutHeight.value,
        opacity: contentOpacity.value,
        transform: [
          { translateX: translateX.value + gestureTranslateX.value },
          { translateY: translateY.value + gestureTranslateY.value },
          { scale: scale.value },
        ],
      };
    });

    const backdropStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
      opacity: opacity.value,
    }));

    const sourceStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
      opacity: sourceOpacity.value,
    }));

    return (
      <>
        <Pressable onPress={handlePress} key={id}>
          <Animated.View
            ref={viewRef}
            onLayout={handleLayout}
            collapsable={false}
            style={sourceStyle}
          >
            {children}
          </Animated.View>
        </Pressable>

        <Modal
          transparent
          visible={isExpanded}
          onRequestClose={animateToOriginal}
        >
          <GestureDetector gesture={panGesture}>
            <View style={styles.modalContainer}>
              <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={animateToOriginal}
                >
                  <Animated.View
                    style={[StyleSheet.absoluteFill, backdropStyle]}
                  >
                    <BlurView
                      experimentalBlurMethod="dimezisBlurView"
                      intensity={50}
                      tint={
                        Platform.OS === "android"
                          ? "systemChromeMaterialDark"
                          : "default"
                      }
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          overflow: "hidden",
                        },
                      ]}
                    />
                  </Animated.View>
                </Pressable>
              </View>

              <Animated.View style={animatedModalStyle} pointerEvents="auto">
                {children}
              </Animated.View>
            </View>
          </GestureDetector>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
});
