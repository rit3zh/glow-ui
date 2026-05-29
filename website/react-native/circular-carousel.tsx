import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { CircularCarouselItemProps, CircularCarouselProps } from "./types";
import { BlurView, type BlurViewProps } from "expo-blur";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  useAnimatedProps,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

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
  dataLength,
}: CircularCarouselItemProps<ItemT>) => {
  const itemWidthWithSpacing = itemWidth + spacing;

  const inputRange = [
    (index - 2) * itemWidthWithSpacing,
    (index - 1) * itemWidthWithSpacing,
    index * itemWidthWithSpacing,
    (index + 1) * itemWidthWithSpacing,
    (index + 2) * itemWidthWithSpacing,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const translateYOutputRange = [
      itemWidth / 4,
      itemWidth / 8,
      0,
      itemWidth / 8,
      itemWidth / 4,
    ];

    const opacityOutputRange = [0.5, 0.8, 1, 0.8, 0.5];
    const scaleOutputRange = [0.75, 0.85, 1, 0.85, 0.75];
    const rotateZOutputRange = [40, 20, 0, -20, -40];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      translateYOutputRange,
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      opacityOutputRange,
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      scaleOutputRange,
      Extrapolation.CLAMP,
    );

    const rotateZ = interpolate(
      scrollX.value,
      inputRange,
      rotateZOutputRange,
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }, { rotateZ: `${rotateZ}deg` }],
    };
  });

  const animatedBlurProps = useAnimatedProps(() => {
    const blurIntensity = interpolate(
      scrollX.value,
      inputRange,
      [80, 40, 0, 40, 80],
      Extrapolation.CLAMP,
    );

    return {
      intensity: blurIntensity,
    };
  });

  const animatedBlurViewStylez = useAnimatedStyle<ViewStyle>(() => {
    const blurIntensity = withSpring(
      interpolate(
        scrollX.value,
        inputRange,
        [4, 8, 0, 8, 4],
        Extrapolation.CLAMP,
      ),
    );

    return {
      filter: [
        {
          blur: blurIntensity,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        animatedStyle,

        Platform.OS === "android" && animatedBlurViewStylez,

        { width: itemWidth, marginHorizontal: spacing / 2 },
        {
          marginRight:
            index === (dataLength ? dataLength - 1 : 0)
              ? SIDE_SPACING - spacing / 2
              : undefined,
        },
      ]}
    >
      <View style={styles.contentWrapper}>
        {renderItem({ item, index })}
        {Platform.OS === "ios" && (
          <AnimatedBlurView
            animatedProps={animatedBlurProps}
            style={[StyleSheet.absoluteFill, styles.blurOverlay]}
            tint="prominent"
          />
        )}
      </View>
    </Animated.View>
  );
};

const CircularCarousel = <ItemT,>({
  data,
  renderItem,
  horizontalSpacing = SIDE_SPACING,
  itemWidth = ITEM_WIDTH,
  spacing = SPACING,
  onIndexChange,
}: CircularCarouselProps<ItemT>) => {
  const scrollX = useSharedValue(0);
  const previousIndex = useSharedValue(-1);
  const itemWidthWithSpacing = itemWidth + spacing;

  useDerivedValue(() => {
    const currentIndex = Math.round(scrollX.value / itemWidthWithSpacing);

    if (currentIndex !== previousIndex.value && previousIndex.value !== -1) {
      if (onIndexChange) {
        scheduleOnRN<[number], void>(onIndexChange, currentIndex);
      }
    }

    previousIndex.value = currentIndex;
  }, []);

  const onScroll = useAnimatedScrollHandler<Record<string, unknown>>({
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
      snapToInterval={itemWidthWithSpacing}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: horizontalSpacing - spacing / 2,
        marginBottom: 20,
        marginTop: 40,
      }}
      style={{
        flexGrow: 0,
        bottom: 2,
      }}
      renderItem={({ item, index }) => (
        <CarouselItem
          item={item}
          index={index}
          dataLength={data.length}
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
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  blurOverlay: {
    borderRadius: 24,
  },
});

export { CircularCarousel };
