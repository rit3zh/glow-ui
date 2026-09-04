import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import type {
  ParallaxCarouselItem,
  ParallaxCarouselItemProps,
  ParallaxCarouselProps,
} from "./types";
import { scheduleOnRN } from "react-native-worklets";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const { width, height } = Dimensions.get("window");

const ParallaxCarouselItemComponent = <ItemT extends ParallaxCarouselItem>({
  item,
  index,
  scrollX,
  renderItem,
  itemWidth,
  itemHeight,
  spacing,
  parallaxIntensity,
}: ParallaxCarouselItemProps<ItemT>) => {
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const offset = index * itemWidth;
    const translateX = interpolate(
      scrollX.value,
      [offset - itemWidth, offset, offset + itemWidth],
      [-itemWidth * parallaxIntensity, 0, itemWidth * parallaxIntensity],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX }],
    };
  }, [index, itemWidth, parallaxIntensity]);

  const innerWidth = itemWidth - spacing * 2;
  const innerHeight = itemHeight - spacing * 2;

  return (
    <View
      style={[styles.itemContainer, { width: itemWidth, height: itemHeight }]}
    >
      <View
        style={[
          styles.imageContainer,
          { width: innerWidth, height: innerHeight },
        ]}
        renderToHardwareTextureAndroid
      >
        {item.image && (
          <Animated.Image
            source={item.image}
            style={[
              styles.image,
              { width: innerWidth, height: innerHeight },
              imageAnimatedStyle,
            ]}
          />
        )}
      </View>
      {renderItem({ item, index })}
    </View>
  );
};

const MemoizedParallaxCarouselItem = React.memo(
  ParallaxCarouselItemComponent,
) as typeof ParallaxCarouselItemComponent;

const ParallaxCarousel = <ItemT extends ParallaxCarouselItem>({
  data,
  renderItem,
  keyExtractor,
  itemWidth = width,
  itemHeight = height * 0.75,
  spacing = 20,
  parallaxIntensity = 0.7,
  pagingEnabled = true,
  showHorizontalScrollIndicator = false,
}: ParallaxCarouselProps<ItemT>) => {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onEndDrag: () => {
      scheduleOnRN(impactAsync, ImpactFeedbackStyle.Rigid);
    },
  });

  const defaultKeyExtractor = useCallback(
    (item: ItemT, index: number) =>
      keyExtractor ? keyExtractor(item, index) : `item-${index}`,
    [keyExtractor],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<ItemT> | null | undefined, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth],
  );

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: ItemT; index: number }) => (
      <MemoizedParallaxCarouselItem
        item={item}
        index={index}
        scrollX={scrollX}
        renderItem={renderItem}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        spacing={spacing}
        parallaxIntensity={parallaxIntensity}
      />
    ),
    [scrollX, renderItem, itemWidth, itemHeight, spacing, parallaxIntensity],
  );

  const sidePadding = useMemo(
    () => Math.max((width - itemWidth) / 2, 0),
    [itemWidth],
  );

  const contentContainerStyle = useMemo(
    () => [styles.flatListContent, { paddingHorizontal: sidePadding }],
    [sidePadding],
  );

  const snapProps = useMemo(
    () =>
      pagingEnabled
        ? {
            snapToInterval: itemWidth,
            snapToAlignment: "start" as const,
            decelerationRate: "fast" as const,
            disableIntervalMomentum: true,
          }
        : {},
    [pagingEnabled, itemWidth],
  );

  return (
    <View style={styles.carouselWrapper}>
      <Animated.FlatList
        data={data}
        keyExtractor={defaultKeyExtractor}
        horizontal
        showsHorizontalScrollIndicator={showHorizontalScrollIndicator}
        onScroll={onScroll}
        style={styles.list}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        removeClippedSubviews={false}
        initialNumToRender={3}
        maxToRenderPerBatch={1}
        windowSize={3}
        overScrollMode="never"
        contentContainerStyle={contentContainerStyle}
        renderItem={renderCarouselItem}
        {...snapProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flexGrow: 0,
  },
  flatListContent: {
    alignItems: "center",
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "cover",
  },
});

export {
  ParallaxCarousel,
  ParallaxCarouselItemProps,
  ParallaxCarouselProps,
  ParallaxCarouselItem,
};
