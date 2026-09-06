import React, {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { BlurView, BlurViewProps } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { createCompoundComponent } from "@/utils/create-compound-component";
import { DialogContext, useDialog } from "./context";
import {
  DIALOG_ANDROID_BLUR_RATIO,
  DIALOG_BLUR_INTENSITY,
  DIALOG_CONTENT_SPRING,
  DIALOG_DISABLED_OPACITY,
  DIALOG_EXIT_TIMING,
  DIALOG_PERSPECTIVE,
  DIALOG_ROTATION,
  DIALOG_SCALE,
  DIALOG_THEME,
} from "./const";
import type {
  IDialogClose,
  IDialogContent,
  IDialogContextValue,
  IDialogDescription,
  IDialogFooter,
  IDialogHeader,
  IDialogOverlay,
  IDialogPortal,
  IDialogRoot,
  IDialogTitle,
  IDialogTrigger,
} from "./types";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const DialogRoot: React.FC<IDialogRoot> = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  theme = "dark",
}: IDialogRoot): React.JSX.Element & React.ReactNode => {
  const isControlled = open !== undefined;
  const [internal, setInternal] = useState<boolean>(defaultOpen);
  const isOpen = isControlled ? open : internal;
  const [isMounted, setIsMounted] = useState<boolean>(isOpen);
  const progress = useSharedValue<number>(isOpen ? 1 : 0);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      progress.value = withSpring<number>(1, DIALOG_CONTENT_SPRING);
      return;
    }
    progress.value = withTiming<number>(0, DIALOG_EXIT_TIMING, (finished) => {
      if (finished) scheduleOnRN(setIsMounted, false);
    });
  }, [isOpen, progress]);

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const openDialog = useCallback((): void => setOpen(true), [setOpen]);
  const closeDialog = useCallback((): void => setOpen(false), [setOpen]);

  const ctx = useMemo<IDialogContextValue>(
    () => ({
      isOpen,
      isMounted,
      theme,
      palette: DIALOG_THEME[theme],
      progress,
      open: openDialog,
      close: closeDialog,
      setOpen,
    }),
    [isOpen, isMounted, theme, progress, openDialog, closeDialog, setOpen],
  );

  return (
    <DialogContext.Provider value={ctx}>{children}</DialogContext.Provider>
  );
};

const DialogTrigger: React.FC<IDialogTrigger> = ({
  children,
  asChild = false,
  disabled = false,
  style,
  testID,
}): React.JSX.Element => {
  const { open } = useDialog("Dialog.Trigger");

  if (asChild && isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: disabled ? undefined : open,
      disabled,
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={open}
      style={({ pressed }) => [
        style,
        (pressed || disabled) && { opacity: DIALOG_DISABLED_OPACITY },
      ]}
      testID={testID}
    >
      {children}
    </Pressable>
  );
};

const DialogPortal: React.FC<IDialogPortal> = ({
  children,
  statusBarTranslucent = true,
  dismissOnBackPress = true,
}: IDialogPortal): React.JSX.Element | null => {
  const { isMounted, close } = useDialog("Dialog.Portal");

  if (!isMounted) return null;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent={statusBarTranslucent}
      navigationBarTranslucent={statusBarTranslucent}
      onRequestClose={dismissOnBackPress ? close : undefined}
    >
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </Modal>
  );
};

const DialogOverlay: React.FC<IDialogOverlay> = ({
  children,
  intensity = DIALOG_BLUR_INTENSITY,
  tint,
  dismissOnPress = true,
  style,
  testID,
}): React.JSX.Element => {
  const { progress, palette, theme, close } = useDialog("Dialog.Overlay");

  const fadeStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }));

  const scrim = tint ?? palette.scrim;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.overlay, fadeStyle, style]}
      pointerEvents="box-none"
      testID={testID}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={35}
          tint={theme === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          {children}
        </BlurView>
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { filter: [{ blur: intensity * DIALOG_ANDROID_BLUR_RATIO }] },
          ]}
          pointerEvents="none"
        >
          {children}
        </View>
      )}

      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: scrim }]}
        pointerEvents="none"
      />

      {dismissOnPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </Animated.View>
  );
};

const DialogContent: React.FC<IDialogContent> = ({
  children,
  from = "top",
  style,
  testID,
}): React.JSX.Element => {
  const { progress, palette } = useDialog("Dialog.Content");

  const isVertical = from === "top" || from === "bottom";
  const initialRotation =
    from === "bottom" || from === "left" ? DIALOG_ROTATION : -DIALOG_ROTATION;

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      progress.value,
      [0, 1],
      [initialRotation, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      progress.value,
      [0, 1],
      [DIALOG_SCALE, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        { perspective: DIALOG_PERSPECTIVE },
        isVertical
          ? { rotateX: `${rotation}deg` }
          : { rotateY: `${rotation}deg` },
        { scale },
      ],
    };
  });
  const animatedBlurViewPropz = useAnimatedProps<BlurViewProps>(() => {
    return {
      intensity: withSpring(
        interpolate(progress.value, [0, 0.5, 1], [0, 16, 0]),
      ),
    };
  });
  return (
    <View style={styles.viewport} pointerEvents="box-none">
      <Animated.View
        accessibilityViewIsModal
        accessibilityRole="alert"
        style={[
          styles.content,
          { backgroundColor: palette.surface, borderColor: palette.border },
          animatedStyle,
          style,
        ]}
        testID={testID}
      >
        {children}
        <AnimatedBlurView
          style={styles.blurOverlay}
          pointerEvents={"none"}
          animatedProps={animatedBlurViewPropz}
        />
      </Animated.View>
    </View>
  );
};

const DialogClose: React.FC<IDialogClose> = ({
  children,
  asChild = false,
  disabled = false,
  style,
  testID,
}): React.JSX.Element => {
  const { close, palette } = useDialog("Dialog.Close");

  if (asChild && isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: disabled ? undefined : close,
      disabled,
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      disabled={disabled}
      onPress={close}
      style={({ pressed }) => [
        children ? null : [styles.close, { backgroundColor: palette.closeBg }],
        style,
        (pressed || disabled) && { opacity: DIALOG_DISABLED_OPACITY },
      ]}
      testID={testID}
    >
      {children ?? <Feather name="x" size={15} color={palette.close} />}
    </Pressable>
  );
};

const DialogHeader: React.FC<IDialogHeader> = ({
  children,
  style,
}): React.JSX.Element => {
  useDialog("Dialog.Header");
  return <View style={[styles.header, style]}>{children}</View>;
};

const DialogFooter: React.FC<IDialogFooter> = ({
  children,
  style,
}): React.JSX.Element => {
  useDialog("Dialog.Footer");
  return <View style={[styles.footer, style]}>{children}</View>;
};

const DialogTitle: React.FC<IDialogTitle> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useDialog("Dialog.Title");
  return (
    <Text style={[styles.title, { color: palette.title }, style]}>
      {children}
    </Text>
  );
};

const DialogDescription: React.FC<IDialogDescription> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useDialog("Dialog.Description");
  return (
    <Text style={[styles.description, { color: palette.description }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 0,
  },
  viewport: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    gap: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 22,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 28,
      },
      android: { elevation: 8 },
    }),
  },
  close: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    gap: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  blurOverlay: {
    position: "absolute",
    overflow: "hidden",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 22,
  },
});

const Dialog = createCompoundComponent("Dialog", DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Close: DialogClose,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
});

export {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  useDialog,
};
export default Dialog;
export type {
  IDialogRoot,
  IDialogTrigger,
  IDialogPortal,
  IDialogOverlay,
  IDialogContent,
  IDialogClose,
  IDialogHeader,
  IDialogFooter,
  IDialogTitle,
  IDialogDescription,
  TDialogTheme,
  TDialogDirection,
} from "./types";
