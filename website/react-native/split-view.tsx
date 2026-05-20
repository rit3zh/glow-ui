import React, { memo } from "react";
import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
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
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { DRAG_HANDLE_HEIGHT } from "./conf";
import type { SplitViewProps, SpringConfig } from "./types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SplitViewInner = <TTop, TBottom>({
  topSectionItems,
  bottomSectionItems,
  bottomSectionTitle,
  initialTopSectionHeight,
  minSectionHeight,
  maxTopSectionHeight,
  maxBottomSectionHeight,
  velocityThreshold,
  springConfig,
  containerBackgroundColor,
  sectionBackgroundColor,
  dividerBackgroundColor,
  dragHandleColor,
  renderTopItem,
  renderBottomItem,
  renderHeader,
  topKeyExtractor,
  bottomKeyExtractor,
  showHeader,
  topListContentContainerStyle,
  bottomListContentContainerStyle,
  topListStyle,
  bottomListStyle,
  sectionTitleStyle,
  sectionTitleTextColor,
}: SplitViewProps<TTop, TBottom>):
  | (React.ReactNode & JSX.Element & React.ReactElement)
  | null => {
  const topSectionHeight = useSharedValue<number>(initialTopSectionHeight);
  const startY = useSharedValue<number>(0);
  const isDragging = useSharedValue<boolean>(false);
  const insets = useSafeAreaInsets();

  const minTopHeight = maxBottomSectionHeight
    ? SCREEN_HEIGHT - maxBottomSectionHeight - 60
    : minSectionHeight;

  const middleHeight = (minTopHeight + maxTopSectionHeight) / 2;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = topSectionHeight.value;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      const nextHeight = startY.value + event.translationY;
      topSectionHeight.value = Math.max(
        minTopHeight,
        Math.min(nextHeight, maxTopSectionHeight),
      );
    })
    .onEnd((event) => {
      "worklet";
      isDragging.value = false;

      let targetHeight: number;

      const clampedVelocity = Math.max(-4000, Math.min(4000, event.velocityY));

      const snapPoints = [minTopHeight, middleHeight, maxTopSectionHeight];

      if (Math.abs(clampedVelocity) > velocityThreshold) {
        const currentHeight = topSectionHeight.value;

        if (clampedVelocity > 0) {
          const nextSnapIndex = snapPoints.findIndex(
            (point) => point > currentHeight + 20,
          );
          targetHeight =
            nextSnapIndex !== -1
              ? snapPoints[nextSnapIndex]
              : maxTopSectionHeight;
        } else {
          const reversedPoints = [...snapPoints].reverse();
          const prevSnapIndex = reversedPoints.findIndex(
            (point) => point < currentHeight - 20,
          );
          targetHeight =
            prevSnapIndex !== -1 ? reversedPoints[prevSnapIndex] : minTopHeight;
        }
      } else {
        let closestPoint = snapPoints[0];
        let minDistance = Math.abs(snapPoints[0] - topSectionHeight.value);

        for (let i = 1; i < snapPoints.length; i++) {
          const distance = Math.abs(snapPoints[i] - topSectionHeight.value);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = snapPoints[i];
          }
        }

        targetHeight = closestPoint;
      }

      topSectionHeight.value = withSpring(targetHeight, {
        ...springConfig,
        overshootClamping: true,
      });
    });

  const topSectionAnimatedStyle = useAnimatedStyle(() => ({
    height: topSectionHeight.value,
    opacity: interpolate(
      topSectionHeight.value,
      [minTopHeight, minTopHeight + 50],
      [0.3, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const bottomSectionAnimatedStyle = useAnimatedStyle(() => {
    const calculatedHeight =
      SCREEN_HEIGHT - topSectionHeight.value - 60 - insets.bottom - insets.top;
    const finalHeight = maxBottomSectionHeight
      ? Math.min(calculatedHeight, maxBottomSectionHeight)
      : calculatedHeight;
    return {
      height: finalHeight,
      opacity: interpolate(
        topSectionHeight.value,
        [maxTopSectionHeight - 50, maxTopSectionHeight],
        [1, 0.5],
        Extrapolation.CLAMP,
      ),
    };
  });

  const dragHandleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isDragging.value ? 1.2 : 1, springConfig) },
    ],
  }));

  const dragHandleContainerAnimatedStyle = useAnimatedStyle(() => ({
    top: topSectionHeight.value - DRAG_HANDLE_HEIGHT / 2,
  }));

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: containerBackgroundColor },
        ]}
      >
        {showHeader && renderHeader?.()}

        <View
          style={[
            styles.mainContainer,
            { backgroundColor: dividerBackgroundColor },
          ]}
        >
          <Animated.View
            style={[
              styles.topSection,
              { backgroundColor: sectionBackgroundColor },
              topSectionAnimatedStyle,
            ]}
          >
            <FlatList
              data={topSectionItems}
              renderItem={renderTopItem}
              keyExtractor={topKeyExtractor}
              style={[styles.list, topListStyle]}
              contentContainerStyle={[
                styles.listContent,
                topListContentContainerStyle,
              ]}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomSection,
              { backgroundColor: sectionBackgroundColor },
              bottomSectionAnimatedStyle,
            ]}
          >
            <View style={[styles.sectionHeader, sectionTitleStyle]}>
              <Text
                style={[styles.sectionTitle, { color: sectionTitleTextColor }]}
              >
                {bottomSectionTitle}
              </Text>
            </View>
            <View style={styles.bottomListContainer}>
              <FlatList
                data={bottomSectionItems}
                renderItem={renderBottomItem}
                keyExtractor={bottomKeyExtractor}
                style={[styles.list, bottomListStyle]}
                contentContainerStyle={[
                  styles.listContent,
                  bottomListContentContainerStyle,
                ]}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              />
            </View>
          </Animated.View>

          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.dragHandleContainer,
                { backgroundColor: dividerBackgroundColor },
                dragHandleContainerAnimatedStyle,
              ]}
            >
              <Animated.View
                style={[
                  styles.dragHandle,
                  { backgroundColor: dragHandleColor },
                  dragHandleAnimatedStyle,
                ]}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export const SplitView = memo(SplitViewInner) as <TTop, TBottom>(
  props: SplitViewProps<TTop, TBottom>,
) => React.ReactNode & JSX.Element;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  mainContainer: { flex: 1 },
  topSection: {
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  bottomSection: {
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomListContainer: {
    flex: 1,
  },
  list: { flex: 1 },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  dragHandleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    marginTop: 15,
    paddingVertical: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 8,
  },
});

export type { SplitViewProps, SpringConfig };
