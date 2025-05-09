import type { MediaListProps } from "./MediaList.types";
import { Dimensions, FlatList, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { useRef, useState, useEffect } from "react";
import { chunkList } from "./utils/chunk";
import { getSnapOffsetsByCount } from "./utils/snap";

const WIDTH = Dimensions.get("window").width;

export const MediaList = <T,>({
  data,
  chunkSize,
  renderItem,
  keyExtractor,
  screenWidth = WIDTH,
  blurIntensity = 15,
  animationConfig = {
    scale: true,
    rotate: true,
    translateY: true,
  },
  contentContainerStyle,
}: MediaListProps<T>): React.ReactNode => {
  const chunkedData = chunkList(data, chunkSize);
  const snapToOffsets = getSnapOffsetsByCount(screenWidth, chunkedData.length);

  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  useEffect(() => {
    const scrollListener = scrollX.addListener(({ value }) => {
      const newIndex = Math.round(value / screenWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    });

    return () => {
      scrollX.removeListener(scrollListener);
    };
  }, [scrollX, activeIndex, screenWidth]);

  return (
    <Animated.FlatList
      data={chunkedData as T[] as any}
      snapToOffsets={snapToOffsets}
      snapToAlignment="start"
      horizontal
      pagingEnabled={true}
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      keyExtractor={(_, index) => index.toString()}
      onScroll={onScroll}
      scrollEventThrottle={16}
      renderItem={({ item: nested, index }) => {
        // Calculate animations based on scroll position
        const inputRange = [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ];

        const blurOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 0, 0.8],
          extrapolate: "clamp",
        });

        const scale = animationConfig.scale
          ? scrollX.interpolate({
              inputRange,
              outputRange: [0.92, 1, 0.92],
              extrapolate: "clamp",
            })
          : 1;

        const rotate = animationConfig.rotate
          ? scrollX.interpolate({
              inputRange,
              outputRange: ["1deg", "0deg", "1deg"],
              extrapolate: "clamp",
            })
          : "0deg";

        const translateY = animationConfig.translateY
          ? scrollX.interpolate({
              inputRange,
              outputRange: [8, 0, 8],
              extrapolate: "clamp",
            })
          : 0;

        return (
          <Animated.View
            style={{
              width: screenWidth,
              transform: [{ scale }, { rotate }, { translateY }],
            }}
          >
            <FlatList
              data={nested}
              contentContainerStyle={[
                {
                  // justifyContent: "center",
                  // alignItems: "center",
                  // marginTop: 10,
                },
                contentContainerStyle,
              ]}
              scrollEnabled={false}
              keyExtractor={keyExtractor}
              renderItem={({ item, index: itemIndex }) => (
                <Animated.View>
                  {renderItem!(item, itemIndex)}

                  <Animated.View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: blurOpacity,
                    }}
                  >
                    <BlurView
                      intensity={blurIntensity}
                      tint="light"
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                </Animated.View>
              )}
            />
          </Animated.View>
        );
      }}
    />
  );
};
