import { BlurView, type BlurViewProps } from "expo-blur";

import * as Haptics from "expo-haptics";
import React, { type FC } from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedBlur = Animated.createAnimatedComponent<BlurViewProps>(BlurView);
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ITEM_HEIGHT = SCREEN_HEIGHT * 0.25;

const VerticalWheelItem: FC<{
  index: number;
  uri: string;
  scrollY: SharedValue<number>;
}> = ({ index, uri, scrollY }) => {
  const positionRange = [
    (index - 2) * ITEM_HEIGHT,
    (index - 1) * ITEM_HEIGHT,
    index * ITEM_HEIGHT,
    (index + 1) * ITEM_HEIGHT,
    (index + 2) * ITEM_HEIGHT,
  ];

  const scaleValues = useDerivedValue(() => {
    const fixedScale = [1, 1, 1, 1, 1];
    return withSpring(fixedScale);
  }, []);

  const scaleAnim = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      positionRange,
      scaleValues.value,
      Extrapolation.CLAMP,
    );
  }, []);

  const blurLevel = useDerivedValue(() => {
    const blurLevels = [100, 80, 0, 80, 100];
    return interpolate(
      scrollY.value,
      positionRange,
      blurLevels,
      Extrapolation.CLAMP,
    );
  }, []);

  const animatedBlurProps = useAnimatedProps(() => {
    return {
      intensity: blurLevel.value,
    };
  });

  const itemStyle = useAnimatedStyle(() => {
    const offsetRange = [
      0,
      -ITEM_HEIGHT / 3,
      -ITEM_HEIGHT / 2,
      -ITEM_HEIGHT / 3,
      0,
    ];
    const fadeRange = [0.5, 1, 1, 1, 0.5];

    const xOffset = interpolate(scrollY.value, positionRange, offsetRange);
    const alpha = interpolate(
      scrollY.value,
      positionRange,
      fadeRange,
      Extrapolation.CLAMP,
    );

    return {
      opacity: alpha,
      transform: [
        {
          translateY: ITEM_HEIGHT / 2 + ITEM_HEIGHT,
        },
        {
          translateX: xOffset,
        },
        { scale: scaleAnim.value },
      ],
    };
  }, []);

  const blurOverlayStyle = useAnimatedStyle(() => {
    const blurOpacity = interpolate(
      blurLevel.value,
      [0, 20, 80],
      [0, 0.5, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: blurOpacity,
    };
  }, []);

  return (
    <Animated.View style={[styles.itemWrapper, itemStyle]}>
      <View style={styles.photoWrapper}>
        <Image style={styles.photo} source={{ uri }} />

        <Animated.View style={[StyleSheet.absoluteFill, blurOverlayStyle]}>
          <AnimatedBlur
            intensity={blurLevel.value}
            animatedProps={animatedBlurProps}
            style={styles.blurLayer}
            tint="dark"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

type VerticalWheelProps = {
  inputs: string[];
};

const VerticalWheel: FC<VerticalWheelProps> = ({ inputs }) => {
  const scrollY = useSharedValue(0);
  const previousIndex = useSharedValue(-1);

  // Function to trigger haptic feedback
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Track current index and trigger haptics when it changes
  useDerivedValue(() => {
    const currentIndex = Math.round(scrollY.value / ITEM_HEIGHT);

    if (currentIndex !== previousIndex.value && previousIndex.value !== -1) {
      scheduleOnRN(triggerHaptic);
    }

    previousIndex.value = currentIndex;
  }, []);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <Animated.FlatList<string>
      snapToInterval={ITEM_HEIGHT}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      data={inputs}
      style={{
        width: ITEM_HEIGHT * 3,
      }}
      contentContainerStyle={styles.content}
      horizontal={false}
      scrollEnabled={true}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      renderItem={({ index }) => (
        <VerticalWheelItem
          uri={inputs[index]}
          index={index}
          scrollY={scrollY}
        />
      )}
      keyExtractor={(_, i) => i.toString()}
    />
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    marginLeft: ITEM_HEIGHT / 1.1,
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
  },
  photo: {
    borderColor: "#fff",
    borderRadius: 200,
    flex: 1,
  },
  photoWrapper: {
    flex: 1,
    margin: 8,
    overflow: "hidden",
  },
  blurLayer: {
    flex: 1,
    borderRadius: 100,
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: ITEM_HEIGHT * 3,
  },
});

export { VerticalWheel };
export default VerticalWheel;
