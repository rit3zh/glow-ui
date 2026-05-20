import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { CinematicCarouselItemProps, CinematicCarouselProps } from "./types";
import { BlurView } from "@sbaiahmed1/react-native-blur";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  useAnimatedProps,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ITEM_WIDTH = SCREEN_WIDTH * 0.75;
const SPACING = 20;
const SIDE_SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const CarouselItem = <ItemT,>({
  item,
  index,
  scrollX,
  renderItem,
  itemWidth = ITEM_WIDTH,
  spacing = SPACING,
}: CinematicCarouselItemProps<ItemT>) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1, 0.85],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );

    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, -50],
      Extrapolation.CLAMP,
    );

    const skewY = interpolate(
      scrollX.value,
      inputRange,
      [5, 0.5, -5],
      Extrapolation.CLAMP,
    );

    const scaleY = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [spacing, 0, -spacing],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { perspective: 400 },
        { rotateY: `${rotateY}deg` },
        { skewY: `${skewY}deg` },
        { translateX },
        { scaleY },
      ],
      opacity,
    };
  });

  const animatedBlurProps = useAnimatedProps(() => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    const blurIntensity = interpolate(
      scrollX.value,
      inputRange,
      [25, 0, 25],
      Extrapolation.CLAMP,
    );

    return {
      blurAmount: blurIntensity,
    };
  });

  return (
    <Animated.View
      style={[styles.itemContainer, animatedStyle, { width: itemWidth }]}
    >
      <View style={styles.contentWrapper}>
        {renderItem({ item, index })}
        <AnimatedBlurView
          style={[StyleSheet.absoluteFillObject, styles.blurOverlay]}
          blurType="regular"
          animatedProps={animatedBlurProps}
          // reducedTransparencyFallbackColor=""
        />
      </View>
    </Animated.View>
  );
};

const CinematicCarousel = <ItemT,>({
  data,
  renderItem,
  horizontalSpacing = SIDE_SPACING,
  itemWidth = ITEM_WIDTH,
  spacing = SPACING,
}: CinematicCarouselProps<ItemT>) => {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.FlatList
      data={data}
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      pagingEnabled
      snapToInterval={itemWidth}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: horizontalSpacing,
        marginTop: 40,
        marginBottom: 20,
        bottom: 2,
      }}
      style={{
        flexGrow: 0,
      }}
      renderItem={({ item, index }) => (
        <CarouselItem
          item={item}
          index={index}
          scrollX={scrollX}
          renderItem={renderItem}
          itemWidth={itemWidth}
          spacing={spacing}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    overflow: "hidden",
    borderRadius: 20,
  },
  blurOverlay: {
    borderRadius: 20,
    overflow: "hidden",
  },
});

export {
  CinematicCarousel,
  CinematicCarouselItemProps,
  CinematicCarouselProps,
};
