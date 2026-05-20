import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SeekBarProps } from "./SeekBar.types";
import { scheduleOnRN } from "react-native-worklets";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

export const SeekBar: React.FC<SeekBarProps> &
  React.FunctionComponent<SeekBarProps> = ({
  value,
  onValueChange,
  width = 300,
  height = 8,
  activeHeight = 10,
  activeColor = "#FFFFFF",
  inactiveColor = "rgba(255, 255, 255, 0.3)",
  disabled = false,
  tapToSeek = true,
  thumbSize = 35,
  thumbColor = "#FFFFFF",
  trackScale: _trackScale,
  thumbScale: _thumbScale,
  containerScale: _containerScale,
  showThumb = true,
}: SeekBarProps):
  | (React.ReactNode & React.JSX.Element & React.ReactElement)
  | null => {
  const initialValue = Math.max(0, Math.min(1, value));
  const progress = useSharedValue<number>(initialValue);
  const isActive = useSharedValue<boolean>(false);
  const trackHeight = useSharedValue<number>(height);
  const thumbScale = useSharedValue<number>(1);
  const containerScaleX = useSharedValue<number>(1);
  const customEasing = Easing.bezier(0.25, 0.1, 0.25, 1);

  useEffect(() => {
    const clampedValue = Math.max(0, Math.min(1, value));
    if (!isActive.value) {
      progress.value = withTiming(clampedValue, {
        duration: 300,
        easing: customEasing,
      });
    }
  }, [value]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart((event) => {
      scheduleOnRN(impactAsync, ImpactFeedbackStyle.Rigid);
      isActive.value = true;
      const newProgress = Math.max(0, Math.min(1, event.x / width));
      progress.value = newProgress;
      scheduleOnRN(onValueChange, newProgress);
      trackHeight.value = withSpring(
        _trackScale ? height * _trackScale : activeHeight,
        {},
      );
      thumbScale.value = withSpring(_thumbScale ?? 1.3, {});
      containerScaleX.value = withSpring(_containerScale ?? 1.05, {});
    })
    .onUpdate((event) => {
      const newProgress = Math.max(0, Math.min(1, event.x / width));
      progress.value = newProgress;
    })
    .onChange((event) => {
      const newProgress = Math.max(0, Math.min(1, event.x / width));
      scheduleOnRN(onValueChange, newProgress);
    })
    .onEnd(() => {
      isActive.value = false;
      trackHeight.value = withSpring(height, {});
      thumbScale.value = withSpring(1, {});
      containerScaleX.value = withSpring(1, {});
      scheduleOnRN(impactAsync, ImpactFeedbackStyle.Rigid);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled && tapToSeek)
    .onStart((event) => {
      const newProgress = Math.max(0, Math.min(1, event.x / width));
      progress.value = withSpring(newProgress, {});
      scheduleOnRN(onValueChange, newProgress);
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const containerAnimatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "height">
  >(() => {
    return {
      height: trackHeight.value,
      transform: [{ scaleX: containerScaleX.value }],
    };
  });

  const trackAnimatedStyle = useAnimatedStyle<Pick<ViewStyle, "height">>(() => {
    return {
      height: trackHeight.value,
    };
  });

  const activeTrackAnimatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "width" | "height">
  >(() => {
    const progressWidth = Math.max(0, Math.min(width, progress.value * width));
    return {
      width: progressWidth,
      height: trackHeight.value,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => {
    const progressWidth = progress.value * width;
    const clampedPosition = Math.max(0, Math.min(width, progressWidth));

    return {
      transform: [
        { translateX: clampedPosition - thumbSize / 2 },
        { scale: thumbScale.value },
      ],
      opacity: showThumb ? 1 : 0,
    };
  });

  return (
    <View
      style={[
        styles.wrapper,
        { width, height: Math.max(activeHeight, thumbSize) },
      ]}
    >
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={styles.gestureContainer}>
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
            <Animated.View
              style={[
                styles.track,
                {
                  width,
                  backgroundColor: inactiveColor,
                },
                trackAnimatedStyle,
              ]}
            />

            <Animated.View
              style={[
                styles.activeTrack,
                {
                  backgroundColor: activeColor,
                },
                activeTrackAnimatedStyle,
              ]}
            />
          </Animated.View>

          {showThumb && (
            <Animated.View
              style={[
                styles.thumb,
                {
                  width: thumbSize,
                  height: thumbSize,
                  backgroundColor: thumbColor,
                  borderRadius: thumbSize / 2,
                },
                thumbAnimatedStyle,
              ]}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  gestureContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
    borderRadius: 2000,
  },
  track: {
    borderRadius: 2000,
  },
  activeTrack: {
    borderRadius: 2000,
    position: "absolute",
  },
  thumb: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SeekBar;
