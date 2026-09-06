import React, { memo, useMemo } from "react";
import { StyleSheet, Image, type ViewStyle, ImageProps } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import type { ICarouselItem, IMaterialCarousel } from "./types";
import { IMAGE_WIDTH, MEDIUM_IMAGE, SCREEN_WIDTH, SMALL_IMAGE } from "./const";

const AnimatedImage = Animated.createAnimatedComponent<ImageProps>(Image);

const CarouselItem: React.FC<ICarouselItem> &
  React.FunctionComponent<ICarouselItem> = memo<ICarouselItem>(
  ({
    item,
    scrollX,
    index,
    renderItem,
    scaleEnabled,
    dataLength,
  }: ICarouselItem):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const isLastImage = useMemo<boolean>(
      () => index + 1 === dataLength,
      [index],
    );
    const isSecondLastItem = useMemo<boolean>(
      () => index + 2 === dataLength,
      [index],
    );

    const inputRange = useMemo<number[]>(
      () => [
        (index - 2) * SMALL_IMAGE,
        (index - 1) * SMALL_IMAGE,
        index * SMALL_IMAGE,
        (index + 1) * SMALL_IMAGE,
      ],
      [index],
    );

    const outputRange = useMemo<number[]>(
      () =>
        isLastImage
          ? [SMALL_IMAGE, MEDIUM_IMAGE, IMAGE_WIDTH, IMAGE_WIDTH]
          : isSecondLastItem
            ? [SMALL_IMAGE, MEDIUM_IMAGE, IMAGE_WIDTH, MEDIUM_IMAGE]
            : [SMALL_IMAGE, MEDIUM_IMAGE, IMAGE_WIDTH, SMALL_IMAGE],
      [isLastImage, isSecondLastItem],
    );

    const rnStylez = useAnimatedStyle<
      Required<
        Partial<
          Pick<ViewStyle, "marginRight" | "marginLeft" | "width" | "transform">
        >
      >
    >(() => {
      return {
        marginRight: 16,
        marginLeft: index === 0 ? 16 : 0,
        width: interpolate(scrollX.value, inputRange, outputRange, "clamp"),
        transform: [
          {
            scale: scaleEnabled
              ? interpolate(
                  scrollX.value,
                  inputRange,
                  [0.8, 0.9, 1, 0.8],
                  Extrapolation.CLAMP,
                )
              : 1,
          },
        ],
      };
    }, [inputRange, outputRange, isLastImage, scaleEnabled]);
    const containerStylez = useAnimatedStyle<
      Required<Partial<Pick<ViewStyle, "width" | "opacity">>>
    >(() => {
      const outPutRangeItem = isLastImage
        ? [0, 1, 1, 1]
        : isSecondLastItem
          ? [0, 1, 0, 0, 1]
          : [0, 0, 1, 0, 1];
      return {
        width: interpolate(
          scrollX.value,
          inputRange,
          outputRange,
          Extrapolation.CLAMP,
        ),
        opacity: interpolate(
          scrollX.value,

          inputRange,
          outPutRangeItem,
          Extrapolation.CLAMP,
        ),
      };
    });
    return (
      <>
        <Animated.View style={[rnStylez]}>
          <AnimatedImage source={{ uri: item }} style={[styles.imageStyle]} />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: "absolute",
            },
            containerStylez,
          ]}
        >
          {renderItem?.(item, index)}
        </Animated.View>
      </>
    );
  },
);

const MaterialCarousel: React.FC<IMaterialCarousel> &
  React.FunctionComponent<IMaterialCarousel> = memo<IMaterialCarousel>(
  ({
    data,
    renderItem: _renderItem,
    scaleEnabled = true,
  }: IMaterialCarousel):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const scrollX = useSharedValue<number>(0);

    const renderItem = ({ item, index }: { item: string; index: number }) => (
      <CarouselItem
        item={item}
        scrollX={scrollX}
        scaleEnabled={scaleEnabled}
        index={index}
        renderItem={_renderItem}
        dataLength={data.length}
      />
    );

    const onScroll = useAnimatedScrollHandler((event) => {
      scrollX.value = event.contentOffset.x;
    });

    return (
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        bounces={true}
        contentInsetAdjustmentBehavior={"always"}
        decelerationRate="fast"
        snapToInterval={SMALL_IMAGE}
        snapToAlignment="start"
        style={{ flexGrow: 0 }}
        contentContainerStyle={[
          styles.listStyle,
          {
            paddingLeft: 16,
            paddingRight: SCREEN_WIDTH / 2 - IMAGE_WIDTH / 2 + 16,
          },
        ]}
        scrollEventThrottle={16}
      />
    );
  },
);

export default memo<
  React.FC<IMaterialCarousel> & React.FunctionComponent<IMaterialCarousel>
>(MaterialCarousel);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  listStyle: {
    alignItems: "center",
  },
  imageStyle: {
    height: 400,
    borderRadius: 24,
  },
});
