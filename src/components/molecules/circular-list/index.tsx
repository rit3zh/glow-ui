import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { FunctionComponent, memo, type FC } from "react";
import { Dimensions, StyleSheet, View, Image, ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { ICircularList, ICircularListItem } from "./types";

const { width: windowWidth } = Dimensions.get("window");
const LIST_ITEM_WIDTH = windowWidth / 4;

const CircularListItem: FC<ICircularListItem> &
  FunctionComponent<ICircularListItem> = memo<ICircularListItem>(
  ({
    index,
    contentOffset,
    imageUri,
    scaleEnabled,
    reverse,
  }: ICircularListItem):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const inputRange = [
      (index - 2) * LIST_ITEM_WIDTH,
      (index - 1) * LIST_ITEM_WIDTH,
      index * LIST_ITEM_WIDTH,
      (index + 1) * LIST_ITEM_WIDTH,
      (index + 2) * LIST_ITEM_WIDTH,
    ];

    const scaleOutputRange = useDerivedValue<number[]>(() => {
      const avoidScalingOutputRange = [1, 1, 1, 1, 1];
      const showScalingOutputRange = [0.5, 0.9, 1.2, 0.9, 0.5];

      const finalOutputRange = scaleEnabled
        ? showScalingOutputRange
        : avoidScalingOutputRange;

      const scaledOutput = withSpring<number[]>(finalOutputRange);

      return scaledOutput;
    }, [scaleEnabled]);

    const scale = useDerivedValue<number>(() => {
      const interpolatedScale = interpolate(
        contentOffset.value,
        inputRange,
        scaleOutputRange.value,
        Extrapolation.CLAMP,
      );

      return interpolatedScale;
    }, [scaleEnabled]);

    const blurIntensity = useDerivedValue<number>(() => {
      const blurOutputRange = [80, 40, 0, 40, 80];

      const interpolatedBlur = interpolate(
        contentOffset.value,
        inputRange,
        blurOutputRange,
        Extrapolation.CLAMP,
      );

      return interpolatedBlur;
    }, []);

    const direction = reverse ? 1 : -1;

    const rStyle = useAnimatedStyle<
      Partial<Required<Pick<ViewStyle, "opacity" | "transform">>>
    >(() => {
      const translateOutputRange = [
        0,
        (direction * LIST_ITEM_WIDTH) / 3,
        (direction * LIST_ITEM_WIDTH) / 2,
        (direction * LIST_ITEM_WIDTH) / 2,
        0,
      ];
      const opacityOutputRange = [0.5, 1, 1, 1, 0.5];

      const translateY = interpolate(
        contentOffset.value,
        inputRange,
        translateOutputRange,
      );
      const opacity = interpolate(
        contentOffset.value,
        inputRange,
        opacityOutputRange,
        Extrapolation.CLAMP,
      );

      return {
        opacity,
        transform: [
          {
            translateX: LIST_ITEM_WIDTH / 2 + LIST_ITEM_WIDTH,
          },
          {
            translateY,
          },
          { scale: scale.value },
        ],
      };
    }, [direction]);

    const blurStyle = useAnimatedStyle<
      Partial<Pick<ViewStyle, "opacity">>
    >(() => {
      return {
        opacity: interpolate(
          blurIntensity.value,
          [0, 50],
          [0, 1],
          Extrapolation.CLAMP,
        ),
      };
    }, []);

    return (
      <Animated.View style={[styles.container, rStyle]}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: imageUri }} />

          <Animated.View style={[StyleSheet.absoluteFill, blurStyle]}>
            <BlurView
              intensity={blurIntensity.value}
              style={styles.blurView}
              tint="dark"
            />
          </Animated.View>
        </View>
      </Animated.View>
    );
  },
);

const CircularList: FC<ICircularList> & FunctionComponent<ICircularList> =
  memo<ICircularList>(
    ({
      data,
      scaleEnabled,
      reverse,
    }: ICircularList):
      | (React.ReactNode & React.JSX.Element & React.ReactElement)
      | null => {
      const contentOffset = useSharedValue<number>(0);
      const previousIndex = useSharedValue<number>(-1);

      const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      };

      useDerivedValue<void>(() => {
        const currentIndex = Math.round(contentOffset.value / LIST_ITEM_WIDTH);

        if (
          currentIndex !== previousIndex.value &&
          previousIndex.value !== -1
        ) {
          scheduleOnRN<[], void>(triggerHaptic);
        }

        previousIndex.value = currentIndex;
      }, []);

      const onScroll = useAnimatedScrollHandler<Record<string, unknown>>({
        onScroll: (event) => {
          contentOffset.value = event.contentOffset.x;
        },
      });

      return (
        <Animated.FlatList<string>
          snapToInterval={LIST_ITEM_WIDTH}
          showsHorizontalScrollIndicator={false}
          style={styles.list}
          pagingEnabled
          contentContainerStyle={styles.listContent}
          horizontal
          data={data}
          scrollEventThrottle={16}
          onScroll={onScroll}
          renderItem={({ index }) => (
            <CircularListItem
              imageUri={data[index]}
              reverse={reverse!}
              scaleEnabled={scaleEnabled}
              index={index}
              contentOffset={contentOffset}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      );
    },
  );

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    width: LIST_ITEM_WIDTH,
  },
  image: {
    borderCurve: "continuous",
    borderRadius: 100,
    borderWidth: 2,
    flex: 1,
  },
  imageContainer: {
    borderCurve: "continuous",
    borderRadius: 100,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    flex: 1,
    margin: 8,
    overflow: "hidden",
  },
  blurView: {
    flex: 1,
    borderRadius: 100,
  },
  list: {
    bottom: 0,
    height: LIST_ITEM_WIDTH * 3,
    left: 0,
    position: "absolute",
    right: 0,
  },
  listContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: LIST_ITEM_WIDTH * 3,
  },
});

export { CircularList };
export default CircularList;
