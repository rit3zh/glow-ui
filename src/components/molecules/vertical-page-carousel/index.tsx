import React from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedProps,
} from "react-native-reanimated";
import type {
  VerticalPageItem,
  VerticalPageItemProps,
  VerticalPageProps,
} from "./types";
import {
  impactAsync,
  ImpactFeedbackStyle,
  AndroidHaptics,
  performAndroidHapticsAsync,
} from "expo-haptics";
import { scheduleOnRN } from "react-native-worklets";

const { height } = Dimensions.get("window");

const VerticalPageItemComponent = <ItemT extends VerticalPageItem>({
  item,
  index,
  scrollY,
  renderItem,
  itemHeight,
  cardMargin,
  cardSpacing,
  scaleRange,
  rotationRange,
  opacityRange,
}: VerticalPageItemProps<ItemT>) => {
  const animatedBlurViewProps = useAnimatedProps(() => {
    const blurAmount = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [20, 0, 20],
      Extrapolation.CLAMP,
    );
    return {
      blurAmount,
    };
  });
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      scaleRange,
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      opacityRange,
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            scrollY.value,
            [index - 1, index, index + 1],
            rotationRange,
          )}deg`,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.itemContainer,
        {
          height: itemHeight + cardSpacing,
          paddingHorizontal: cardMargin,
        },
      ]}
    >
      <Animated.View
        style={[styles.card, { height: itemHeight }, animatedStyle]}
      >
        <Animated.View style={[styles.imageContainer]}>
          {item.image && (
            <Animated.Image
              source={item.image}
              style={[styles.image, imageAnimatedStyle]}
            />
          )}
        </Animated.View>
        {renderItem({ item, index })}
      </Animated.View>
    </View>
  );
};

const VerticalPageCarousel = <ItemT extends VerticalPageItem>({
  data,
  renderItem,
  keyExtractor,
  itemHeight = height * 0.7,
  cardMargin = 20,
  cardSpacing = 20,
  pagingEnabled = true,
  showVerticalScrollIndicator = false,
  scaleRange = [0.9, 1, 0.9],
  rotationRange = [0, 0, 0],
  opacityRange = [0.5, 1, 0.5],
}: VerticalPageProps<ItemT>) => {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y / (itemHeight + cardSpacing);
    },
    onEndDrag: () => {
      if (Platform.OS === "ios") {
        scheduleOnRN(impactAsync, ImpactFeedbackStyle.Medium);
      } else {
        scheduleOnRN(performAndroidHapticsAsync, AndroidHaptics.Confirm);
      }
    },
  });

  const defaultKeyExtractor = (item: ItemT, index: number) =>
    keyExtractor ? keyExtractor(item, index) : `item-${index}`;

  return (
    <View style={styles.carouselWrapper}>
      <Animated.FlatList
        data={data}
        keyExtractor={defaultKeyExtractor}
        horizontal={false}
        pagingEnabled={pagingEnabled}
        showsVerticalScrollIndicator={showVerticalScrollIndicator}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={itemHeight + cardSpacing}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.flatListContent,
          { paddingVertical: (height - itemHeight) / 2 - cardSpacing / 2 },
        ]}
        renderItem={({ item, index }) => (
          <VerticalPageItemComponent
            item={item}
            index={index}
            scrollY={scrollY}
            renderItem={renderItem}
            itemHeight={itemHeight}
            cardMargin={cardMargin}
            cardSpacing={cardSpacing}
            scaleRange={scaleRange}
            rotationRange={rotationRange}
            opacityRange={opacityRange}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  flatListContent: {
    // paddingVertical is calculated dynamically
  },
  itemContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export {
  VerticalPageCarousel,
  VerticalPageItemProps,
  VerticalPageProps,
  VerticalPageItem,
};
