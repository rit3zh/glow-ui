import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

interface Props {
  content?: React.ReactNode;
  expandedContent?: React.ReactNode;
}

export const TestCard = ({ content, expandedContent }: Props) => {
  const insets = useSafeAreaInsets();
  const initialSize =
    Dimensions.get("window").width - 40 - insets.left - insets.right - 20;

  const height = useSharedValue<number>(initialSize);
  const width = useSharedValue<number>(initialSize);
  const backdropOpacity = useSharedValue(0);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleOnPress = () => {
    if (!isExpanded) {
      height.value = HEIGHT;
      width.value = WIDTH;
      backdropOpacity.value = withTiming(0.7); // Fade in backdrop
    } else {
      height.value = initialSize;
      width.value = initialSize;
      backdropOpacity.value = withTiming(0, {}, () => {
        backdropOpacity.value = 0; // Fade out backdrop after the animation
      });
    }
    setIsExpanded(!isExpanded);
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value, {
        duration: 300,
      }),
      width: withTiming(width.value, {
        duration: 300,
        // easing: (t) => t, // Smooth transition for the card width
      }),
      borderRadius: withSpring(isExpanded ? 20 : 40),
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <>
      {isExpanded && (
        <Pressable onPress={handleOnPress} style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
            <View style={styles.expandedContentWrapper}>{expandedContent}</View>
          </Animated.View>
        </Pressable>
      )}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={[styles.center, {}]}>
          <Pressable onPress={handleOnPress}>
            <Animated.View style={[styles.card, animatedCardStyle]}>
              <Animated.View
                style={[
                  styles.contentWrapper,
                  animatedContentStyle, // Apply animation to content visibility
                ]}
              >
                {content}
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  expandedContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
