import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import type { SeekBarProps } from "./SeekBar.types";

export const SeekBar: React.FC<SeekBarProps> = ({
  value,
  onValueChange,
  width = 300,
  height = 2,
  activeHeight = 4,
  activeColor = "#FFFFFF",
  inactiveColor = "rgba(255, 255, 255, 0.3)",
  disabled = false,
  tapToSeek = true,
}) => {
  const initialValue = Math.max(0, Math.min(1, value));
  const progress = useSharedValue(initialValue);
  const isActive = useSharedValue(false);
  const trackScale = useSharedValue(1);

  const customEasing = Easing.bezier(0.25, 0.1, 0.25, 1);

  React.useEffect(() => {
    const clampedValue = Math.max(0, Math.min(1, value));
    if (!isActive.value) {
      progress.value = withTiming(clampedValue, {
        duration: 300,
        easing: customEasing,
      });
    }
  }, [value]);

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startProgress: number }
  >({
    onStart: (_, context) => {
      if (disabled) return;
      context.startProgress = progress.value;
      isActive.value = true;
      trackScale.value = withTiming(activeHeight / height, {
        duration: 200,
        easing: customEasing,
      });
    },
    onActive: (event, context) => {
      if (disabled) return;

      const progressDelta = event.translationX / width;
      const newProgress = Math.max(
        0,
        Math.min(1, context.startProgress + progressDelta),
      );

      progress.value = newProgress;
      runOnJS(onValueChange)(newProgress);
    },
    onFinish: () => {
      if (disabled) return;
      isActive.value = false;
      trackScale.value = withTiming(1, {
        duration: 200,
        easing: customEasing,
      });
    },
  });

  const tapGestureHandler =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (event) => {
        if (disabled || !tapToSeek) return;

        const newProgress = Math.max(0, Math.min(1, event.x / width));
        progress.value = withTiming(newProgress, {
          duration: 300,
          easing: customEasing,
        });

        trackScale.value = withSequence(
          withTiming(activeHeight / height, {
            duration: 200,
            easing: customEasing,
          }),
          withTiming(1, {
            duration: 200,
            easing: customEasing,
          }),
        );

        runOnJS(onValueChange)(newProgress);
      },
    });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: trackScale.value }],
      borderRadius: 100,
    };
  });

  const activeTrackAnimatedStyle = useAnimatedStyle(() => {
    const progressWidth = Math.max(0, Math.min(width, progress.value * width));
    return {
      width: progressWidth,
      borderRadius: 99,
    };
  });

  return (
    <View style={[styles.wrapper, { width, height: activeHeight }]}>
      <TapGestureHandler onGestureEvent={tapGestureHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View
              style={[
                styles.container,
                {
                  width,
                  height,
                },
                containerAnimatedStyle,
              ]}
            >
              <View
                style={[
                  styles.track,
                  {
                    width,
                    height,
                    backgroundColor: inactiveColor,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.activeTrack,
                  {
                    height,
                    backgroundColor: activeColor,
                  },
                  activeTrackAnimatedStyle,
                ]}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  track: {
    borderRadius: 90,
  },
  activeTrack: {
    borderRadius: 200,
    position: "absolute",
  },
});

export default SeekBar;
