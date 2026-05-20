import {
  StyleSheet,
  View,
  Pressable,
  FlatList,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { memo, useCallback, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  Extrapolation,
  interpolateColor,
  useAnimatedProps,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BlurView, type BlurViewProps } from "expo-blur";
import { scheduleOnRN } from "react-native-worklets";
import type { IPicker } from "./types";

const AnimatedBlurView =
  Animated.createAnimatedComponent<Partial<BlurViewProps>>(BlurView);

const DEFAULT_ITEM_HEIGHT = 44;
const DEFAULT_VISIBLE_ITEMS = 7;

export const Picker: React.FC<IPicker> & React.FunctionComponent<IPicker> =
  memo<IPicker>(
    ({
      items,
      onIndexChange,
      onItemChange,
      initialIndex = 0,
      itemHeight = DEFAULT_ITEM_HEIGHT,
      fontSize = 20,
      textColor = "#8E8E93",
      selectedTextColor = "#fff",
      backgroundColor = "#F2F2F7",
      hapticFeedback = true,
      selectionAreaBackgroundColor = "rgba(255, 255, 255, 0.06)",
      width,
    }: React.ComponentProps<typeof Picker> | IPicker):
      | (React.ReactNode & React.ReactElement & React.JSX.Element)
      | null => {
      const scrollY = useSharedValue<number>(initialIndex * itemHeight);
      const lastSelectedIndex = useRef<number>(initialIndex);
      const flatListRef = useRef<FlatList>(null);
      const pickerHeight = itemHeight * DEFAULT_VISIBLE_ITEMS;

      useEffect(() => {
        if (flatListRef.current && initialIndex > 0) {
          setTimeout<[]>(() => {
            flatListRef.current?.scrollToOffset({
              offset: initialIndex * itemHeight,
              animated: false,
            });
          }, 100);
        }
      }, [initialIndex, itemHeight]);

      const triggerHaptic = useCallback<() => void>(() => {
        if (hapticFeedback) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, [hapticFeedback]);

      const handleIndexChange = useCallback(
        (index: number) => {
          const roundedIndex = Math.round(index);

          if (roundedIndex !== lastSelectedIndex.current) {
            lastSelectedIndex.current = roundedIndex;
            triggerHaptic();

            if (onIndexChange) {
              onIndexChange(roundedIndex);
            }

            if (
              onItemChange &&
              roundedIndex >= 0 &&
              roundedIndex < items.length
            ) {
              onItemChange(items[roundedIndex], roundedIndex);
            }
          }
        },
        [items, onIndexChange, onItemChange, triggerHaptic],
      );

      const AnimatedItem = useCallback(
        ({ item, index }: { item: string; index: number }) => {
          const animatedStyle = useAnimatedStyle<
            Required<Partial<Pick<ViewStyle, "opacity" | "transform">>>
          >(() => {
            const centerOffset = index * itemHeight;
            const distance = scrollY.value - centerOffset;
            const normalizedDistance = distance / itemHeight;
            const absDistance = Math.abs(normalizedDistance);

            const opacity = interpolate(
              absDistance,
              [0, 0.3, 0.6, 1, 1.5, 2],
              [1, 0.85, 0.6, 0.35, 0.15, 0.05],
              Extrapolation.CLAMP,
            );

            const scale = interpolate(
              absDistance,
              [0, 1, 2],
              [1, 0.96, 0.94],
              Extrapolation.CLAMP,
            );

            const translateY = interpolate(
              normalizedDistance,
              [-3, -2, -1, 0, 1, 2, 3],
              [15, 10, 5, 0, -5, -10, -15],
              Extrapolation.CLAMP,
            );
            const rotateX = interpolate(
              normalizedDistance,
              [-3, -2, -1, 0, 1, 2, 3],
              [85, 60, 30, 0, -30, -60, -85],
              Extrapolation.CLAMP,
            );
            return {
              opacity,
              transform: [
                { perspective: 1400 },
                { translateY },
                { rotateX: `${rotateX}deg` },
                { scale },
              ],
            };
          });

          const textAnimatedStyle = useAnimatedStyle<
            Required<Partial<Pick<TextStyle, "color" | "fontWeight">>>
          >(() => {
            const centerOffset = index * itemHeight;
            const distance = scrollY.value - centerOffset;
            const normalizedDistance = Math.abs(distance / itemHeight);

            const isSelected = normalizedDistance < 0.5;

            return {
              color: interpolateColor(
                normalizedDistance,
                [0, 1],
                [selectedTextColor, textColor],
              ),
              fontWeight: isSelected ? "600" : "400",
            };
          });

          const blurAnimatedProps = useAnimatedProps<BlurViewProps>(() => {
            const centerOffset = index * itemHeight;
            const distance = Math.abs(scrollY.value - centerOffset);
            const normalizedDistance = distance / itemHeight;

            const blurOpacity = interpolate(
              normalizedDistance,
              [0, 0.6, 1.2, 2],
              [0, 2.5, 3.5, 6],
              Extrapolation.CLAMP,
            );

            return {
              intensity: blurOpacity,
            };
          });

          return (
            <Animated.View
              style={[
                styles.item,
                { height: itemHeight, width: width },
                animatedStyle,
              ]}
            >
              <Animated.Text
                style={[
                  styles.itemText,
                  {
                    fontSize,
                  },
                  textAnimatedStyle,
                ]}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {item}
              </Animated.Text>
              <AnimatedBlurView
                animatedProps={blurAnimatedProps}
                tint="light"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    overflow: "hidden",
                    borderRadius: 99,
                  },
                ]}
                pointerEvents="none"
              />
            </Animated.View>
          );
        },
        [scrollY, itemHeight, fontSize, textColor, selectedTextColor],
      );

      const onScroll = useAnimatedScrollHandler<Record<string, unknown>>({
        onScroll: (event) => {
          scrollY.value = event.contentOffset.y;

          const interpolatedIndex = interpolate(
            event.contentOffset.y,
            items.map((_, i) => i * itemHeight),
            items.map((_, i) => i),
            Extrapolation.CLAMP,
          );

          scheduleOnRN(handleIndexChange, interpolatedIndex);
        },
      });

      const scrollToIndex = useCallback(
        (index: number) => {
          flatListRef.current?.scrollToOffset({
            offset: index * itemHeight,
            animated: true,
          });
        },
        [itemHeight],
      );

      const renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => (
          <Pressable key={index} onPress={() => scrollToIndex(index)}>
            <AnimatedItem item={item} index={index} />
          </Pressable>
        ),
        [AnimatedItem, scrollToIndex],
      );

      return (
        <View style={[styles.container, { height: pickerHeight }]}>
          <View style={[styles.background, { backgroundColor }]} />
          <Animated.FlatList
            ref={flatListRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={itemHeight}
            contentContainerStyle={{
              paddingVertical: (pickerHeight - itemHeight) / 2,
            }}
            showsVerticalScrollIndicator={false}
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            disableIntervalMomentum
            bounces={true}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
          />

          <View
            style={[
              styles.selectionArea,
              {
                top: (pickerHeight - itemHeight) / 2,
                height: itemHeight,
                width: width,
                backgroundColor: selectionAreaBackgroundColor,
              },
            ]}
            pointerEvents="none"
          />

          <LinearGradient
            colors={[
              backgroundColor,
              backgroundColor,
              `${backgroundColor}F2`,
              `${backgroundColor}DD`,
              `${backgroundColor}CC`,
              `${backgroundColor}AA`,
              `${backgroundColor}77`,
              `${backgroundColor}33`,
              `${backgroundColor}00`,
            ]}
            locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.65, 0.8, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.gradient,
              styles.topGradient,
              { height: (pickerHeight - itemHeight) / 2 + 10 },
            ]}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[
              `${backgroundColor}00`,
              `${backgroundColor}33`,
              `${backgroundColor}77`,
              `${backgroundColor}AA`,
              `${backgroundColor}CC`,
              `${backgroundColor}DD`,
              `${backgroundColor}F2`,
              backgroundColor,
              backgroundColor,
            ]}
            locations={[0, 0.2, 0.35, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.gradient,
              styles.bottomGradient,
              { height: (pickerHeight - itemHeight) / 2 + 10 },
            ]}
            pointerEvents="none"
          />

          <View
            style={[
              styles.selectionIndicator,
              {
                top: (pickerHeight - itemHeight) / 2,
                height: itemHeight,
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.indicatorLine} />
            <View
              style={[styles.indicatorLine, { bottom: 0, top: undefined }]}
            />
          </View>
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    textAlign: "center",
    letterSpacing: -0.3,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topGradient: {
    top: -5,
  },
  bottomGradient: {
    bottom: -5,
  },
  selectionArea: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 5,

    borderRadius: 20,
  },
  selectionIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "space-between",
    zIndex: 15,
  },
  indicatorLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(60, 60, 67, 0.29)",
  },
});
