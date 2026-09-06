import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { withDelay, withTiming } from "react-native-reanimated";

import {
  commitTiming,
  COMMIT_MS,
  EXIT_MS,
  releaseTiming,
} from "../toast.animation";
import { TOAST_VIEWPORT_OFFSET } from "../toast.constants";
import { useToastTheme } from "../toast.theme";
import type { IToastItem } from "../Toast.types";
import { ToastBody } from "./toast-body";
import { useToastIcon } from "./toast-item.utils";
import { ToastSwipeAction } from "./toast-swipe-action";
import { useToastLayout } from "./use-toast-layout";
import { useToastLifecycle } from "./use-toast-lifecycle";
import { useToastMotion } from "./use-toast-motion";
import { useToastSwipe } from "./use-toast-swipe";

const ToastItem = memo((props: IToastItem) => {
  const {
    toast,
    toasts,
    heightMap,
    index,
    expanded,
    expandByDefault,
    interacting,
    gap,
    position,
    visibleToasts,
    closeButton,
    swipeToDismiss,
    swipeDirection,
    swipeAction,
    haptics,
    duration,
    icons,
    toastStyle,
    titleStyle,
    descriptionStyle,
    setHeights,
    removeToast,
    onInteractingChange,
    onExpand,
  } = props;

  const { styles } = useToastTheme();
  const { width: screenW, height: screenH } = useWindowDimensions();

  const [row, setRow] = useState({ width: 0, height: 0 });
  const [swipeOpen, setSwipeOpen] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const type = toast.type ?? "default";
  const dismissible = toast.dismissible !== false;
  const disabled = type === "loading";

  const action =
    toast.swipeAction === null ? undefined : (toast.swipeAction ?? swipeAction);
  const gesturesEnabled = swipeToDismiss && dismissible && !disabled;
  const actionMode = gesturesEnabled && action != null;

  // Guarded: this feeds animated `width`, and a non-finite layout value is a
  // native crash rather than a visual glitch.
  const rowWidth =
    row.width > 0
      ? row.width
      : Math.max(1, screenW - TOAST_VIEWPORT_OFFSET * 2);

  const layout = useToastLayout({
    toastId: toast.id,
    toasts,
    heightMap,
    selfHeight: row.height,
    index,
    position,
    expanded,
    expandByDefault,
    gap,
    visibleToasts,
  });

  const motion = useToastMotion({ toast, layout, actionMode });
  // Shared values are stable for the row's lifetime; depending on them rather
  // than on `motion` keeps the callbacks below — and with them the pan gesture
  // they feed — from being rebuilt on every render of every mounted toast.
  const { dragX, presence } = motion;

  const { close, dismissBySwipe } = useToastLifecycle({
    toast,
    duration,
    disabled,
    paused: expanded || interacting || swipeOpen,
    presence: motion.presence,
    removeToast,
  });

  const resetSwipe = useCallback(() => {
    dragX.value = withTiming(0, releaseTiming);
    presence.value = withTiming(1, { duration: EXIT_MS });
    setSwipeOpen(false);
  }, [dragX, presence]);

  const commitBySwipe = useCallback(() => {
    action?.onCommit?.(toast);

    if (action?.dismissOnCommit === false) {
      resetTimer.current = setTimeout(resetSwipe, COMMIT_MS + 60);
      return;
    }
    dismissBySwipe(COMMIT_MS);
  }, [action, toast, dismissBySwipe, resetSwipe]);

  const commitByPress = useCallback(() => {
    const sign =
      action?.direction === "right"
        ? 1
        : action?.direction === "both"
          ? Math.sign(dragX.value) || -1
          : -1;

    dragX.value = withTiming(sign * rowWidth, commitTiming);
    presence.value = withDelay(COMMIT_MS, withTiming(0, { duration: EXIT_MS }));
    setSwipeOpen(false);
    commitBySwipe();
  }, [action, dragX, presence, rowWidth, commitBySwipe]);

  const pan = useToastSwipe({
    enabled: gesturesEnabled,
    swipeDirection,
    action,
    isBottom: layout.isBottom,
    rowWidth,
    screenW,
    screenH,
    haptics,
    dragX: motion.dragX,
    dragY: motion.dragY,
    lockedAxis: motion.lockedAxis,
    swipeOrigin: motion.swipeOrigin,
    armed: motion.armed,
    presence: motion.presence,
    commitBySwipe,
    dismissBySwipe,
    onOpenChange: setSwipeOpen,
    onInteractingChange,
  });

  const iconNode = useToastIcon(toast, type, icons);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;

      setRow((prev) =>
        prev.height === height && prev.width === width
          ? prev
          : { width, height },
      );

      setHeights((prev) => {
        const exists = prev.find((x) => x.toastId === toast.id);
        if (!exists) return [{ toastId: toast.id, height, position }, ...prev];
        if (exists.height === height) return prev;
        return prev.map((x) => (x.toastId === toast.id ? { ...x, height } : x));
      });
    },
    [setHeights, toast.id, position],
  );

  const handleCancel = useCallback(() => {
    toast.cancel?.onPress(toast.id);
    close(false);
  }, [toast, close]);

  const handleAction = useCallback(() => {
    toast.action?.onPress(toast.id);
    close(false);
  }, [toast, close]);

  const handleClose = useCallback(() => close(false), [close]);

  const handlePress = useCallback(() => {
    if (swipeOpen) {
      resetSwipe();
      return;
    }
    onExpand();
  }, [swipeOpen, resetSwipe, onExpand]);

  const anchorStyle = layout.isBottom ? { bottom: 0 } : { top: 0 };
  const zIndex = toasts.length - index;

  return (
    <Animated.View
      pointerEvents="box-none"
      onLayout={handleLayout}
      style={[
        styles.toastWrapper,
        anchorStyle,
        { zIndex },
        motion.wrapperStyle,
      ]}
    >
      <GestureDetector gesture={pan}>
        <Animated.View>
          {actionMode && action && action.direction !== "right" ? (
            <ToastSwipeAction
              action={action}
              toast={toast}
              side="left"
              rowHeight={row.height}
              rowWidth={rowWidth}
              dragX={motion.dragX}
              onPress={commitByPress}
            />
          ) : null}

          {actionMode &&
          action &&
          (action.direction === "right" || action.direction === "both") ? (
            <ToastSwipeAction
              action={action}
              toast={toast}
              side="right"
              rowHeight={row.height}
              rowWidth={rowWidth}
              dragX={motion.dragX}
              onPress={commitByPress}
            />
          ) : null}

          <Animated.View style={motion.surfaceStyle}>
            <Pressable
              onPress={handlePress}
              accessibilityRole="alert"
              accessibilityLabel={
                typeof toast.title === "string" ? toast.title : undefined
              }
              style={[styles.toast, toastStyle, toast.style]}
            >
              <Animated.View style={[styles.inner, motion.contentFadeStyle]}>
                <ToastBody
                  toast={toast}
                  iconNode={iconNode}
                  type={type}
                  dismissible={dismissible}
                  closeButton={closeButton}
                  icons={icons}
                  titleStyle={titleStyle}
                  descriptionStyle={descriptionStyle}
                  onCancel={handleCancel}
                  onAction={handleAction}
                  onClose={handleClose}
                />
              </Animated.View>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
});

ToastItem.displayName = "ToastItem";

export { ToastItem };
