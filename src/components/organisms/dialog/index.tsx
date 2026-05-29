import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  PressableProps,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Easing,
  Extrapolation,
  LinearTransition,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import type {
  DialogCloseProps,
  DialogComponent,
  DialogProps,
  DialogTriggerProps,
  DialogBackdropProps,
  ExtendedDialogContextType,
  ExtendedDialogContentProps,
} from "./types";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const DialogContext = createContext<ExtendedDialogContextType | undefined>(
  undefined,
);

const useDialogContext = (): ExtendedDialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
};

export const Dialog: DialogComponent = ({ children }: DialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationProgress = useSharedValue<number>(0);

  const closeDialog = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const contextValue = React.useMemo(
    () => ({ isOpen, setIsOpen, closeDialog, animationProgress }),
    [isOpen, closeDialog, animationProgress],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DialogContent) {
          return React.cloneElement(child, {
            ...child.props!,
            isAnimating,
            setIsAnimating,
          } as any);
        }
        return child;
      })}
    </DialogContext.Provider>
  );
};

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild }) => {
  const { setIsOpen } = useDialogContext();

  const handlePress = (): void => {
    setIsOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: handlePress,
    } as Partial<PressableProps>);
  }

  return <Pressable onPress={handlePress}>{children}</Pressable>;
};

const DialogBackdrop: React.FC<DialogBackdropProps> = ({
  children,
  blurAmount = 20,
  backgroundColor = "rgba(0, 0, 0, 0.5)",
  blurType = "dark",
}) => {
  const { animationProgress, isOpen } = useDialogContext();

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  const backdropBlurAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: withSpring(
        interpolate(
          animationProgress.value,
          [0, 1],
          [0, blurAmount],
          Extrapolation.CLAMP,
        ),
      ),
    };
  });

  return (
    <Animated.View
      style={[styles.backdrop, backdropAnimatedStyle]}
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <AnimatedBlurView
        style={StyleSheet.absoluteFill}
        animatedProps={backdropBlurAnimatedProps}
        layout={LinearTransition.duration(300).easing(
          Easing.inOut(Easing.ease),
        )}
        tint={blurType}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      {children}
    </Animated.View>
  );
};

const DialogContent: React.FC<ExtendedDialogContentProps> = ({
  children,
  onClose,
  isAnimating: externalIsAnimating,
  setIsAnimating: externalSetIsAnimating,
}) => {
  const { isOpen, setIsOpen, animationProgress } = useDialogContext();

  useEffect(() => {
    if (isOpen) {
      animationProgress.value = withTiming(1, {
        duration: 550,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (externalIsAnimating) {
      animationProgress.value = withTiming(
        0,
        {
          duration: 650,
          easing: Easing.bezier(0.4, 0, 1, 1),
        },
        (finished) => {
          if (finished) {
            scheduleOnRN(setIsOpen, false);
            scheduleOnRN(externalSetIsAnimating!, false);
            if (onClose) {
              scheduleOnRN(onClose);
            }
          }
        },
      );
    }
  }, [externalIsAnimating]);

  const handleBackdropPress = useCallback(() => {
    externalSetIsAnimating?.(true);
  }, [externalSetIsAnimating]);

  const handleRequestClose = useCallback(() => {
    externalSetIsAnimating?.(true);
  }, [externalSetIsAnimating]);

  const contentStyle = useAnimatedStyle(() => {
    const opacity = externalIsAnimating
      ? interpolate(
          animationProgress.value,
          [0, 0.7, 0.4, 1],
          [0, 0.7, 0.4, 1],
          Extrapolation.CLAMP,
        )
      : interpolate(
          animationProgress.value,
          [0, 0.8, 0.9, 1],
          [0, 0.8, 0.9, 1],
          Extrapolation.CLAMP,
        );

    const rotateX = externalIsAnimating
      ? interpolate(
          animationProgress.value,
          [0, 1],
          [-55, 0],
          Extrapolation.CLAMP,
        )
      : interpolate(
          animationProgress.value,
          [0, 1],
          [-25, 0],
          Extrapolation.CLAMP,
        );

    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [20, 0],
      Extrapolation.EXTEND,
    );

    const skewX = interpolate(
      animationProgress.value,
      [0, 1],
      [-1.5, 0],
      Extrapolation.CLAMP,
    );

    const scale = externalIsAnimating
      ? interpolate(
          animationProgress.value,
          [0, 1],
          [0.6, 1],
          Extrapolation.CLAMP,
        )
      : interpolate(
          animationProgress.value,
          [0, 1],
          [0.85, 1],
          Extrapolation.CLAMP,
        );
    const blur = externalIsAnimating
      ? withSpring(
          interpolate(
            animationProgress.value,
            [0, 0.5, 1],
            [15, 10, 0],
            Extrapolation.CLAMP,
          ),
        )
      : withSpring(
          interpolate(
            animationProgress.value,
            [0, 0.5, 1],
            [3, 1.5, 0],
            Extrapolation.CLAMP,
          ),
        );
    return {
      filter: [
        {
          blur,
        },
      ],
      opacity,
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
        { translateY },
        { scale },
        { skewX: `${skewX}deg` },
      ],
    };
  });

  const contentBlurAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: externalIsAnimating
        ? interpolate(
            animationProgress.value,
            [0, 0.5, 1],
            [45, 30, 0],
            Extrapolation.CLAMP,
          )
        : interpolate(
            animationProgress.value,
            [0, 0.7, 0.4, 1],
            [13, 10, 5, 0],
            Extrapolation.CLAMP,
          ),
    };
  });

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.contentWrapper, contentStyle]}>
            <TouchableWithoutFeedback>
              <View>
                {children}
                <AnimatedBlurView
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      overflow: "hidden",
                    },
                  ]}
                  animatedProps={contentBlurAnimatedProps}
                  tint="prominent"
                  pointerEvents="none"
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const DialogClose: React.FC<DialogCloseProps> = ({ children, asChild }) => {
  const { closeDialog } = useDialogContext();

  const handlePress = (): void => {
    closeDialog();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: handlePress,
    } as Partial<PressableProps>);
  }

  return <Pressable onPress={handlePress}>{children}</Pressable>;
};

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Close = DialogClose;
Dialog.Backdrop = DialogBackdrop;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 400,
  },
  content: {},
});
