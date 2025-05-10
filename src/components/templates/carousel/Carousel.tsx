import React, { useCallback } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ListRenderItemInfo,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  useAnimatedReaction,
  WithTimingConfig,
  WithSpringConfig,
  Extrapolation,
} from "react-native-reanimated";
import {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

// Screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Animation configurations
const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

const DEFAULT_TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
};

// Default values
const DEFAULT_ITEM_WIDTH = SCREEN_WIDTH * 0.7;
const DEFAULT_ITEM_HEIGHT = 250;
const DEFAULT_SPACING = 10;
const DEFAULT_BLUR_INTENSITY = 40;

export type AnimationType = "spring" | "timing" | "none";

export type CarouselOptions = {
  blur?: boolean;
  blurIntensity?: number;
  scale?: boolean;
  minScale?: number;
  fade?: boolean;
  minOpacity?: number;
  rotate?: boolean;
  maxRotate?: number; // Degrees
  translateY?: boolean;
  maxTranslateY?: number; // Pixels
  animationType?: AnimationType;
  perspective?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

export type CarouselStyles = {
  containerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
};

export type AdvancedCarouselProps<T> = {
  data: T[];
  renderItem: (
    item: T,
    index: number,
    animatedValue: SharedValue<number>
  ) => React.ReactNode;
  itemWidth?: number;
  itemHeight?: number;
  spacing?: number;
  options?: CarouselOptions;
  styles?: CarouselStyles;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  horizontal?: boolean;
  loop?: boolean;
  pagingEnabled?: boolean;
};

export function Carousel<T>({
  data,
  renderItem,
  itemWidth = DEFAULT_ITEM_WIDTH,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  spacing = DEFAULT_SPACING,
  options = {},
  styles = {},
  initialIndex = 0,
  onIndexChange,
  horizontal = true,
  loop = false,
  pagingEnabled = true,
}: AdvancedCarouselProps<T>) {
  // Animation values
  const scrollValue = useSharedValue(initialIndex * itemWidth);
  const currentIndex = useSharedValue(initialIndex);

  // Auto-play functionality
  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (options.autoPlay && data.length > 1) {
      interval = setInterval(() => {
        const nextIndex = (currentIndex.value + 1) % data.length;
        scrollValue.value = withTiming(
          nextIndex * itemWidth,
          DEFAULT_TIMING_CONFIG
        );
      }, options.autoPlayInterval || 3000);
    }

    return () => clearInterval(interval);
  }, [options.autoPlay, options.autoPlayInterval, data.length, itemWidth]);

  // Index change detection
  useAnimatedReaction(
    () => Math.round(scrollValue.value / itemWidth),
    (newIndex) => {
      if (newIndex !== currentIndex.value) {
        currentIndex.value = newIndex;
        onIndexChange?.(newIndex);
      }
    }
  );

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollValue.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.x / itemWidth);
      if (options.animationType === "spring") {
        scrollValue.value = withSpring(
          newIndex * itemWidth,
          DEFAULT_SPRING_CONFIG
        );
      } else if (options.animationType === "timing") {
        scrollValue.value = withTiming(
          newIndex * itemWidth,
          DEFAULT_TIMING_CONFIG
        );
      }
    },
  });

  // Keyextractor
  const keyExtractor = useCallback(
    (_: any, index: number) => `carousel-item-${index}`,
    []
  );

  return (
    <View style={[styles.containerStyle, { height: itemHeight + spacing * 5 }]}>
      <Animated.FlatList
        data={data}
        keyExtractor={keyExtractor}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + spacing * 2}
        decelerationRate="fast"
        bounces={true}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_WIDTH / 2 - itemWidth / 0.9 - spacing,
          paddingVertical: itemHeight * 0.1,
        }}
        snapToAlignment="center"
        pagingEnabled={pagingEnabled}
        renderItem={({ item, index }: ListRenderItemInfo<T>) => (
          <CarouselItem
            item={item}
            index={index}
            scrollValue={scrollValue}
            renderItem={renderItem}
            options={options}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            spacing={spacing}
            itemContainerStyle={styles.itemContainerStyle}
          />
        )}
      />
    </View>
  );
}

type ItemProps<T> = {
  item: T;
  index: number;
  scrollValue: SharedValue<number>;
  renderItem: (
    item: T,
    index: number,
    animatedValue: SharedValue<number>
  ) => React.ReactNode;
  options: CarouselOptions;
  itemWidth: number;
  itemHeight: number;
  spacing: number;
  itemContainerStyle?: ViewStyle;
};

function CarouselItem<T>({
  item,
  index,
  scrollValue,
  renderItem,
  options,
  itemWidth,
  itemHeight,
  spacing,
  itemContainerStyle,
}: ItemProps<T>) {
  // Animation input range based on item position
  const inputRange = [
    (index - 1) * (itemWidth + spacing * 2),
    index * (itemWidth + spacing * 2),
    (index + 1) * (itemWidth + spacing * 2),
  ];

  // Distance from current position (for animations)
  const animatedDistanceValue = useSharedValue(0);

  // Update the distance value based on scroll position
  useAnimatedReaction(
    () => scrollValue.value,
    (scrollPos) => {
      const itemCenter = index * (itemWidth + spacing * 2);
      animatedDistanceValue.value =
        Math.abs(scrollPos - itemCenter) / (itemWidth + spacing * 2);
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate the position relative to the center
    const position = interpolate(
      scrollValue.value,
      inputRange,
      [-1, 0, 1],
      Extrapolate.CLAMP
    );

    // Scale animation
    const scale = options.scale
      ? interpolate(
          scrollValue.value,
          inputRange,
          [options.minScale || 0.8, 1, options.minScale || 0.8],
          Extrapolation.CLAMP
        )
      : 1;

    // Opacity animation
    const opacity = options.fade
      ? interpolate(
          scrollValue.value,
          inputRange,
          [options.minOpacity || 0.6, 1, options.minOpacity || 0.6],
          Extrapolate.CLAMP
        )
      : 1;

    // Rotation animation
    const rotateZ = options.rotate
      ? `${interpolate(
          scrollValue.value,
          inputRange,
          [options.maxRotate || 10, 0, -(options.maxRotate || 10)],
          Extrapolate.CLAMP
        )}deg`
      : "0deg";

    // Translate Y animation
    const translateY = options.translateY
      ? interpolate(
          scrollValue.value,
          inputRange,
          [options.maxTranslateY || 20, 0, options.maxTranslateY || 20],
          Extrapolate.CLAMP
        )
      : 0;

    // Perspective effect
    const perspective = options.perspective ? 1000 : undefined;

    return {
      transform: [
        { perspective: perspective || 1000 },
        { scale },
        { rotateZ },
        { translateY },
      ],
      opacity,
    };
  });

  return (
    <View
      style={{
        width: itemWidth,
        height: itemHeight,
        marginHorizontal: spacing,
      }}
    >
      <Animated.View
        style={[
          styles.itemContainer,
          { height: itemHeight },
          itemContainerStyle,
          animatedStyle,
        ]}
      >
        {options.blur ? (
          <BlurView
            intensity={options.blurIntensity || DEFAULT_BLUR_INTENSITY}
            style={StyleSheet.absoluteFillObject}
          >
            {renderItem(item, index, animatedDistanceValue)}
          </BlurView>
        ) : (
          renderItem(item, index, animatedDistanceValue)
        )}
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  itemContainer: {
    overflow: "hidden",
  },
});
