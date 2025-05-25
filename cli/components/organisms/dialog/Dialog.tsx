import React, { useContext, useState, ReactNode, useEffect } from "react";
import { DialogStyles as styles } from "./styles/styles";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { DialogContext } from "./context/DialogContext";
import { useDialog } from "./hooks/useDialog";
import { DialogComponent } from "./Dialog.types";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Dialog: DialogComponent = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

Dialog.Trigger = ({ children }: { children: ReactNode }): JSX.Element => {
  const { setOpen } = useDialog();
  return <Pressable onPress={() => setOpen(true)}>{children}</Pressable>;
};

Dialog.Content = function DialogContent({ children }: { children: ReactNode }) {
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
};

Dialog.Title = ({ children }: { children: ReactNode }): JSX.Element => (
  <Text style={styles.title}>{children}</Text>
);

Dialog.Description = ({ children }: { children: ReactNode }): JSX.Element => (
  <Text style={styles.description}>{children}</Text>
);

Dialog.Close = ({ children }: { children: ReactNode }): JSX.Element => {
  const { setOpen } = useDialog();
  return <Pressable onPress={() => setOpen(false)}>{children}</Pressable>;
};
