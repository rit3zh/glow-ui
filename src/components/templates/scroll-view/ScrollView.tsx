import { CustomScrollViewProps } from "./ScrollView.types";
import React, { useCallback, useRef, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  WithTimingConfig,
  WithSpringConfig,
} from "react-native-reanimated";
import { DefaultRefreshIndicator } from "./resource/default/DefaultRefreshIndicator";

// Default configurations
const DEFAULT_TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
};

const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 10,
  stiffness: 100,
  mass: 1,
  overshootClamping: false,
};

export const CustomScrollView: React.FC<CustomScrollViewProps> = ({
  children,
  onRefresh,
  RefreshComponent = DefaultRefreshIndicator,
  refreshTriggerDistance = 80,
  maxPullDistance = 120,
  useSpringAnimation = false,
  timingConfig = DEFAULT_TIMING_CONFIG,
  springConfig = DEFAULT_SPRING_CONFIG,
  showScrollIndicator = false,
  scrollIndicatorColor = "#999",
  refreshControlContainerStyle,
  contentWrapperStyle,
  pullToRefreshEnabled = true,
  enableOverscroll = true,
  pullResistanceFactor = 1,
  autoHideRefreshControl = true,
  hideRefreshControlDelay = 5000, // Default changed to 5000ms
  onPullDistanceChange,
  refreshFromAnyPosition = false,
  enableHapticFeedback = false,
  onRefreshStateChange,
  scrollThreshold = 0,
  scrollToTopAfterRefresh = false,
  scrollToTopDuration = 300,
  minIndicatorDisplayTime = 5000, // New prop to control minimum display time
  ...props
}) => {
  // Refs
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshStartTimeRef = useRef<number>(0);

  // Animated values
  const isPulling = useSharedValue(false);
  const isRefreshing = useSharedValue(false);
  const pullDistance = useSharedValue(0);
  const isAtTop = useSharedValue(true);
  const scrollY = useSharedValue(0);

  // Local state to track refresh operation completion
  const [refreshCompleted, setRefreshCompleted] = useState(false);

  // Calculate effective refresh trigger and max distance
  const effectiveRefreshTriggerDistance =
    refreshTriggerDistance * pullResistanceFactor;
  const effectiveMaxPullDistance = maxPullDistance * pullResistanceFactor;

  // Handle haptic feedback
  const triggerHapticFeedback = useCallback(() => {
    // Implementation would connect to a native module for haptic feedback
    console.log("Haptic feedback triggered");
  }, []);

  // Handle refresh state change
  const handleRefreshStateChange = useCallback(
    (refreshing: boolean) => {
      if (onRefreshStateChange) {
        onRefreshStateChange(refreshing);
      }
    },
    [onRefreshStateChange]
  );

  // Update pull distance callback
  const updatePullDistance = useCallback(
    (distance: number) => {
      if (onPullDistanceChange) {
        onPullDistanceChange(distance);
      }
    },
    [onPullDistanceChange]
  );

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      scrollY.value = offsetY;

      // Check if we're at the top of the content
      isAtTop.value = offsetY <= scrollThreshold;

      // Only allow pulling when at top or refreshFromAnyPosition is enabled
      if (
        (isAtTop.value || refreshFromAnyPosition) &&
        pullToRefreshEnabled &&
        offsetY < 0
      ) {
        // Apply resistance factor for natural feel
        const newPullDistance = Math.min(
          effectiveMaxPullDistance,
          Math.abs(offsetY) / pullResistanceFactor
        );

        pullDistance.value = newPullDistance;
        isPulling.value = true;

        // Notify about pull distance change
        runOnJS(updatePullDistance)(newPullDistance);

        // Trigger haptic feedback exactly at the threshold
        if (
          enableHapticFeedback &&
          pullDistance.value >= effectiveRefreshTriggerDistance &&
          pullDistance.value - 1 < effectiveRefreshTriggerDistance
        ) {
          runOnJS(triggerHapticFeedback)();
        }
      } else {
        isPulling.value = false;
      }
    },
    onEndDrag: (event) => {
      // Only trigger refresh if pulling beyond threshold and refresh function exists
      if (
        pullToRefreshEnabled &&
        pullDistance.value > effectiveRefreshTriggerDistance &&
        onRefresh &&
        !isRefreshing.value
      ) {
        runOnJS(onRefresh)();
      } else if (pullDistance?.value > 0) {
        // Reset the pull distance if not triggering refresh
        pullDistance.value = useSpringAnimation
          ? withSpring(0, springConfig)
          : withTiming(0, timingConfig);
      }
    },
  });

  // Helper function to ensure indicator stays visible for minimum time
  const completeRefreshWithMinimumDelay = useCallback(() => {
    setRefreshCompleted(true);

    // Calculate how long the refresh has been showing already
    const elapsedTime = Date.now() - refreshStartTimeRef.current;
    const remainingTime = Math.max(0, minIndicatorDisplayTime - elapsedTime);

    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Set timer to hide indicator after remaining time
    refreshTimerRef.current = setTimeout(() => {
      // Only hide if we're still in refreshing state
      if (isRefreshing.value) {
        pullDistance.value = useSpringAnimation
          ? withSpring(0, springConfig)
          : withTiming(0, timingConfig);
        isRefreshing.value = false;
        handleRefreshStateChange(false);
        setRefreshCompleted(false);
      }
    }, remainingTime);
  }, [
    minIndicatorDisplayTime,
    useSpringAnimation,
    springConfig,
    timingConfig,
    handleRefreshStateChange,
  ]);

  // Handle refresh trigger
  const triggerRefresh = useCallback(async () => {
    if (isRefreshing.value || !onRefresh) return;

    // Record start time of refresh
    refreshStartTimeRef.current = Date.now();
    setRefreshCompleted(false);

    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    // Set refreshing state
    isRefreshing.value = true;
    handleRefreshStateChange(true);

    // Keep indicator visible at trigger threshold during refresh
    pullDistance.value = useSpringAnimation
      ? withSpring(effectiveRefreshTriggerDistance, springConfig)
      : withTiming(effectiveRefreshTriggerDistance, timingConfig);

    try {
      // Execute refresh function
      await onRefresh();

      // Optional: scroll to top after refresh
      if (scrollToTopAfterRefresh && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      // Handle completion with minimum display time
      completeRefreshWithMinimumDelay();
    }
  }, [
    onRefresh,
    effectiveRefreshTriggerDistance,
    useSpringAnimation,
    springConfig,
    timingConfig,
    scrollToTopAfterRefresh,
    handleRefreshStateChange,
    completeRefreshWithMinimumDelay,
  ]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Content container animation
  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Only apply padding if pull to refresh is enabled
    return {
      paddingTop: pullToRefreshEnabled ? refreshTriggerDistance : 0,
    };
  });

  // Memoize the content style to avoid unnecessary re-renders
  const contentContainerStyle = useMemo(
    () => [
      contentAnimatedStyle,
      props.contentContainerStyle,
      contentWrapperStyle,
    ],
    [contentAnimatedStyle, props.contentContainerStyle, contentWrapperStyle]
  );

  // Public methods
  React.useImperativeHandle(
    props.innerRef as any,
    () => ({
      ...scrollViewRef.current,
      // Add custom methods
      triggerRefresh: () => {
        triggerRefresh();
      },
      isRefreshing: () => isRefreshing.value,
      scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => {
        scrollViewRef.current?.scrollTo(options);
      },
      scrollToEnd: (options?: { animated?: boolean }) => {
        scrollViewRef.current?.scrollToEnd(options);
      },
    }),
    [triggerRefresh, isRefreshing.value]
  );

  return (
    <View style={[styles.container, props.style]}>
      {pullToRefreshEnabled && (
        <View
          style={[styles.refreshControlContainer, refreshControlContainerStyle]}
        >
          <RefreshComponent
            progress={pullDistance}
            threshold={effectiveRefreshTriggerDistance}
            isPulling={isPulling}
            isRefreshing={isRefreshing}
            pullDistance={pullDistance}
            refreshTriggerDistance={effectiveRefreshTriggerDistance}
            maxPullDistance={effectiveMaxPullDistance}
            refreshCompleted={refreshCompleted}
          />
        </View>
      )}

      <Animated.ScrollView
        ref={scrollViewRef}
        {...props}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={showScrollIndicator}
        indicatorStyle={"black"}
        bounces={enableOverscroll}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  refreshControlContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  refreshContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    flexDirection: "row",
  },
  refreshIcon: {
    fontSize: 24,
    marginRight: 8,
    fontWeight: "bold",
  },
  refreshText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
