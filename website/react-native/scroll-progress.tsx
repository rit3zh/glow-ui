import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ScrollProgressProps {
  children: React.ReactNode;
  progressColor?: string;
  backgroundColor?: string;
  height?: number;
  position?: "top" | "bottom";
  style?: ViewStyle;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  children,
  progressColor = "#000",
  backgroundColor = "#e0e0e0",
  height = 4,
  position = "top",
  style,
}) => {
  const scrollY = useSharedValue(0);
  const contentHeight = useSharedValue(1);
  const scrollViewHeight = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      contentHeight.value = event.contentSize.height;
      scrollViewHeight.value = event.layoutMeasurement.height;
    },
  });

  // Calculate scroll progress (0-100)
  const scrollProgress = useDerivedValue(() => {
    const maxScroll = contentHeight.value - scrollViewHeight.value;
    if (maxScroll <= 0) return 0;
    const progress = (scrollY.value / maxScroll) * 100;
    return Math.min(Math.max(progress, 0), 100);
  });

  // Animated progress bar style
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${scrollProgress.value}%`, {
        damping: 20,
        stiffness: 90,
      }),
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          {
            height,
            backgroundColor,
            [position]: 0,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: progressColor,
              height,
            },
            progressBarStyle,
          ]}
        />
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  progressBar: {
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
