import { ReactNode, useContext, useEffect, useState } from "react";
import { DialogContext } from "../context/DialogContext";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Pressable, StyleSheet, View } from "react-native";
import { DialogStyles as styles } from "../styles/styles";
import { BlurView } from "expo-blur";
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function DialogContent({ children }: { children: ReactNode }) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog.Content must be used within <Dialog>");
  const { open, setOpen } = ctx;

  const [isMounted, setIsMounted] = useState(open);

  // Shared animation values
  const animationProgress = useSharedValue(0);
  const translateY = useSharedValue(10); // Initial position slightly below target
  const scale = useSharedValue(0.97);
  const opacity = useSharedValue(0);
  const blurOpacity = useSharedValue(0);

  // Dialog animation style with more natural transitions
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  // Blur animation style
  const blurAnimatedStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  const springConfig = {
    damping: 18,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,

    restSpeedThreshold: 2,
  };

  const timingConfig = {
    duration: 220,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  };

  useEffect(() => {
    if (open) {
      setIsMounted(true);

      blurOpacity.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      });

      opacity.value = withTiming(1, timingConfig);
      translateY.value = withSpring(0, springConfig);
      scale.value = withSpring(1, springConfig);
    } else if (isMounted) {
      opacity.value = withTiming(0, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });

      // Subtle exit animation
      translateY.value = withTiming(8, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });

      scale.value = withTiming(0.96, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });

      blurOpacity.value = withTiming(
        0,
        {
          duration: 200,
          easing: Easing.in(Easing.ease),
        },
        () => {
          runOnJS(setIsMounted)(false);
        }
      );
    }
  }, [open]);

  if (!isMounted) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Pressable onPress={() => setOpen(false)} style={styles.backdrop}>
        <AnimatedBlurView
          intensity={25}
          tint="dark"
          style={[StyleSheet.absoluteFill, blurAnimatedStyle]}
        />
      </Pressable>
      <View style={styles.centered}>
        <Animated.View style={[styles.modal, animatedStyle]}>
          {children}
        </Animated.View>
      </View>
    </View>
  );
}
