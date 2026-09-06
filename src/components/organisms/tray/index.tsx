// @ts-check
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import {
  DEFAULT_CLOSE_THRESHOLD,
  DEFAULT_CLOSE_VELOCITY,
  DEFAULT_MOTION,
  DEFAULT_RADIUS,
  PALETTES,
} from "./const";
import {
  TrayContext,
  TrayTintContext,
  useTray,
  useTrayContext,
  useTrayTint,
} from "./context";
import {
  nearestOffsetIndex,
  projectPosition,
  resolveDetent,
  rubberBand,
  toOffsets,
} from "./helper";
import { useTrayNavigation } from "./hooks";
import type {
  ITray,
  ITrayBack,
  ITrayBody,
  ITrayClose,
  ITrayContent,
  ITrayContext,
  ITrayFooter,
  ITrayHeader,
  ITrayMotion,
  ITrayPalette,
  ITrayScrollView,
  ITraySubtitle,
  ITrayTitle,
  ITrayTrigger,
  ITrayView,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const TrayDismissContext = createContext<boolean>(true);

const TrayRoot: React.FC<ITray> & React.FunctionComponent<ITray> = ({
  children,
  defaultView = "default",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onViewChange,
  theme = "light",
  palette: paletteProp,
  radius = DEFAULT_RADIUS,
  closeThreshold = DEFAULT_CLOSE_THRESHOLD,
  closeVelocity = DEFAULT_CLOSE_VELOCITY,
  dismissOnBackdropPress = true,
  enableDragToDismiss = true,
  detents,
  initialDetent = 0,
  onDetentChange,
  motion: motionProp,
}: ITray): React.JSX.Element & React.ReactNode => {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const open = isControlled ? (openProp as boolean) : internalOpen;

  const [mounted, setMounted] = useState<boolean>(open);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const { offsets, detentHeight } = useMemo(() => {
    if (!detents || detents.length === 0) {
      return { offsets: [0], detentHeight: 0 };
    }
    const available = screenHeight - insets.top - insets.bottom;
    const heights = detents.map((detent) => resolveDetent(detent, available));
    return { offsets: toOffsets(heights), detentHeight: Math.max(...heights) };
  }, [detents, screenHeight, insets.top, insets.bottom]);
  const reduceMotion = useReducedMotion();
  const motion = useMemo<ITrayMotion>(
    () => ({ ...DEFAULT_MOTION, ...motionProp }),
    [motionProp],
  );

  const navigation = useTrayNavigation(defaultView, onViewChange);
  const present = useSharedValue<number>(0);
  const offset = useSharedValue<number>(0);
  const startOffset = useSharedValue<number>(0);
  const detentIndex = useSharedValue<number>(0);
  const travel = useSharedValue<number>(0);
  const sheetHeight = useSharedValue<number>(0);
  const scrollY = useSharedValue<number>(0);
  const owns = useSharedValue<boolean>(false);
  const origin = useSharedValue<number>(0);
  const hasScrollable = useSharedValue<boolean>(false);
  const isDragging = useSharedValue<boolean>(false);

  const measured = useRef<number>(0);
  const presented = useRef<boolean>(false);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const reset = useCallback(() => {
    presented.current = false;
    measured.current = 0;
    sheetHeight.value = 0;
    travel.value = 0;
    offset.value = 0;
    startOffset.value = 0;
    scrollY.value = 0;
    owns.value = false;
    origin.value = 0;
    present.value = 0;
  }, [
    sheetHeight,
    travel,
    offset,
    startOffset,
    scrollY,
    owns,
    origin,
    present,
  ]);

  const finishClose = useCallback(() => {
    setMounted(false);
    reset();
  }, [reset]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const openTray = useCallback(
    (view?: string) => {
      navigation.reset(view ?? defaultView);
      setOpen(true);
    },
    [navigation, defaultView, setOpen],
  );

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const next = detentHeight
        ? detentHeight
        : Math.round(event.nativeEvent.layout.height);
      if (next <= 0 || Math.abs(measured.current - next) < 1) return;

      const first = measured.current === 0;
      measured.current = next;
      travel.value = next + insets.bottom + motion.travelPadding;

      if (first || reduceMotion) sheetHeight.value = next;
      else sheetHeight.value = withSpring(next, motion.heightSpring);

      if (presented.current) return;
      presented.current = true;

      const start = offsets[Math.min(initialDetent, offsets.length - 1)] ?? 0;
      offset.value = start;
      detentIndex.value = Math.min(initialDetent, offsets.length - 1);
      present.value = reduceMotion ? 1 : withSpring(1, motion.presentSpring);
    },
    [
      detentHeight,
      insets.bottom,
      reduceMotion,
      motion,
      sheetHeight,
      travel,
      present,
      offsets,
      initialDetent,
      offset,
      detentIndex,
    ],
  );

  const dismiss = useCallback(
    (velocity: number) => {
      setOpen(false);
      if (reduceMotion) {
        present.value = 0;
        finishClose();
        return;
      }
      present.value = withSpring(
        0,
        {
          ...motion.presentSpring,
          velocity: -velocity / Math.max(travel.value, 1),
          overshootClamping: true,
        },
        (finished) => {
          "worklet";
          if (finished) scheduleOnRN(finishClose);
        },
      );
    },
    [reduceMotion, motion, present, travel, finishClose, setOpen],
  );

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!presented.current) return;
    if (reduceMotion) {
      present.value = 0;
      finishClose();
      return;
    }
    present.value = withSpring(
      0,
      { ...motion.presentSpring, overshootClamping: true },
      (finished) => {
        "worklet";
        if (finished) scheduleOnRN(finishClose);
      },
    );
  }, [open, reduceMotion, motion, present, finishClose]);

  const settleTo = useCallback(
    (index: number) => {
      onDetentChange?.(index);
    },
    [onDetentChange],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enableDragToDismiss && !reduceMotion)
        .activeOffsetY(motion.activeOffsetY)
        .failOffsetX(motion.failOffsetX)
        .onBegin(() => {
          "worklet";
          owns.value = false;
          origin.value = 0;
          startOffset.value = offset.value;
          isDragging.value = false;
        })
        .onUpdate((event) => {
          "worklet";
          if (!owns.value) {
            const expanded = startOffset.value <= 0.5;
            const canScroll = hasScrollable.value && expanded;
            const atTop = !canScroll || scrollY.value <= 0;

            if (!atTop || (canScroll && event.translationY <= 0)) {
              isDragging.value = false;
              return;
            }
            owns.value = true;

            origin.value = event.translationY;
          }

          const travelled = event.translationY - origin.value;
          const next = startOffset.value + travelled;

          if (next < 0) {
            offset.value = -rubberBand(
              -next,
              travel.value,
              motion.overDragFactor,
            );
            isDragging.value = true;
            return;
          }

          offset.value = next;
          isDragging.value = true;
        })
        .onEnd((event) => {
          "worklet";
          if (!owns.value) return;

          const projected = projectPosition(
            offset.value,
            event.velocityY,
            motion.flickProjection,
          );
          const last = offsets[offsets.length - 1];

          if (
            projected > last + closeThreshold ||
            (event.velocityY > closeVelocity && offset.value > 0)
          ) {
            scheduleOnRN(dismiss, event.velocityY);
            return;
          }

          const index = nearestOffsetIndex(offsets, projected);
          detentIndex.value = index;
          offset.value = withSpring(offsets[index], {
            ...motion.detentSpring,
            velocity: event.velocityY,
          });
          scheduleOnRN(settleTo, index);
        })
        .onFinalize(() => {
          "worklet";
          owns.value = false;
          isDragging.value = false;
        }),
    [
      enableDragToDismiss,
      reduceMotion,
      motion,
      isDragging,
      owns,
      origin,
      startOffset,
      offset,
      detentIndex,
      offsets,
      hasScrollable,
      scrollY,
      travel,
      closeThreshold,
      closeVelocity,
      dismiss,
      settleTo,
    ],
  );

  const palette = useMemo<ITrayPalette>(
    () => ({ ...PALETTES[theme], ...paletteProp }),
    [theme, paletteProp],
  );

  const ctx = useMemo<ITrayContext>(
    () => ({
      visible: mounted,
      view: navigation.view,
      direction: navigation.direction,
      canGoBack: navigation.canGoBack,
      open: openTray,
      close,
      setView: navigation.setView,
      goBack: navigation.goBack,
      height: sheetHeight,
      present,
      dragY: offset,
      offset,
      offsets,
      detentHeight,
      travel,
      scrollY,
      isDragging,
      hasScrollable,
      pan,
      onContentLayout,
      palette,
      radius,
      motion,
      reduceMotion,
    }),
    [
      mounted,
      navigation.view,
      navigation.direction,
      navigation.canGoBack,
      navigation.setView,
      navigation.goBack,
      openTray,
      close,
      sheetHeight,
      present,
      offset,
      offsets,
      detentHeight,
      travel,
      scrollY,
      isDragging,
      hasScrollable,
      pan,
      onContentLayout,
      palette,
      radius,
      motion,
      reduceMotion,
    ],
  );

  return (
    <TrayContext.Provider value={ctx}>
      <TrayDismissContext.Provider value={dismissOnBackdropPress}>
        {children}
      </TrayDismissContext.Provider>
    </TrayContext.Provider>
  );
};

const TrayTrigger: React.FC<ITrayTrigger> &
  React.FunctionComponent<ITrayTrigger> = ({
  children,
  view,
  style,
}: ITrayTrigger): React.JSX.Element => {
  const { open, palette } = useTrayContext("Tray.Trigger");
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => open(view)}
      style={style}
    >
      <TrayTintContext.Provider value={palette.text}>
        {children}
      </TrayTintContext.Provider>
    </Pressable>
  );
};

const TrayContent: React.FC<ITrayContent> &
  React.FunctionComponent<ITrayContent> = ({
  children,
  style,
}: ITrayContent): React.JSX.Element | null => {
  const {
    visible,
    close,
    height,
    present,
    dragY,
    travel,
    pan,
    onContentLayout,
    palette,
    radius,
    motion,
  } = useTrayContext("Tray.Content");
  const insets = useSafeAreaInsets();
  const dismissOnBackdropPress = useContext(TrayDismissContext);

  const transformStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - present.value) * travel.value + dragY.value },
      {
        scale: interpolate(
          present.value,
          [0, 1],
          [motion.startScale, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const heightStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: height.value === 0 ? 0 : 1,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity:
      present.value *
      interpolate(
        dragY.value,
        [0, Math.max(travel.value, 1)],
        [1, motion.backdropFalloff],
        Extrapolation.CLAMP,
      ),
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible
      animationType="none"
      onRequestClose={close}
    >
      <View style={styles.fill} pointerEvents="box-none">
        <AnimatedPressable
          style={[
            styles.backdrop,
            { backgroundColor: palette.backdrop },
            backdropStyle,
          ]}
          onPress={dismissOnBackdropPress ? close : undefined}
        />

        <View
          style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}
          pointerEvents="box-none"
        >
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                styles.sheet,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  borderRadius: radius,
                },
                transformStyle,
                style,
              ]}
            >
              <Animated.View style={[styles.clip, heightStyle]}>
                <View style={styles.measure} onLayout={onContentLayout}>
                  <View style={styles.handleArea}>
                    <View
                      style={[
                        styles.handle,
                        { backgroundColor: palette.handle },
                      ]}
                    />
                  </View>
                  {children}
                </View>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </Modal>
  );
};

const TrayView: React.FC<ITrayView> & React.FunctionComponent<ITrayView> = ({
  children,
  id,
  style,
}: ITrayView): React.JSX.Element | null => {
  const { view, direction, reduceMotion, motion } = useTrayContext("Tray.View");
  const active = view === id;

  const [rendered, setRendered] = useState<boolean>(active);
  const progress = useSharedValue<number>(active ? 1 : 0);
  const slideFrom = useSharedValue<number>(0);

  useEffect(() => {
    if (active) {
      setRendered(true);
      slideFrom.value = direction;
      progress.value = reduceMotion ? 1 : withSpring(1, motion.viewInSpring);
      return;
    }
    if (progress.value === 0) return;
    slideFrom.value = -direction;
    if (reduceMotion) {
      progress.value = 0;
      setRendered(false);
      return;
    }
    progress.value = withTiming(0, motion.viewOutTiming, (finished) => {
      "worklet";
      if (finished) scheduleOnRN(setRendered, false);
    });
  }, [active, direction, progress, slideFrom, reduceMotion, motion]);

  const layerStyle = useAnimatedStyle(() => {
    const shift = (1 - progress.value) * motion.viewSlide * slideFrom.value;
    const scale = {
      scale: interpolate(
        progress.value,
        [0, 1],
        [motion.viewStartScale, 1],
        Extrapolation.CLAMP,
      ),
    };

    if (motion.viewAxis === "none") {
      return { opacity: progress.value, transform: [scale] };
    }
    return {
      opacity: progress.value,
      transform: [
        motion.viewAxis === "y" ? { translateY: shift } : { translateX: shift },
        scale,
      ],
    };
  });

  if (!rendered) return null;

  return (
    <Animated.View
      pointerEvents={active ? "auto" : "none"}
      style={[
        active ? styles.activeLayer : styles.idleLayer,
        layerStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const TrayHeader: React.FC<ITrayHeader> &
  React.FunctionComponent<ITrayHeader> = ({
  children,
  style,
}: ITrayHeader): React.JSX.Element => (
  <View style={[styles.header, style]}>{children}</View>
);

const TrayTitle: React.FC<ITrayTitle> & React.FunctionComponent<ITrayTitle> = ({
  children,
  style,
}: ITrayTitle): React.JSX.Element => {
  const { palette } = useTrayContext("Tray.Title");
  return (
    <Text style={[styles.title, { color: palette.text }, style]}>
      {children}
    </Text>
  );
};

const TraySubtitle: React.FC<ITraySubtitle> &
  React.FunctionComponent<ITraySubtitle> = ({
  children,
  style,
}: ITraySubtitle): React.JSX.Element => {
  const { palette } = useTrayContext("Tray.Subtitle");
  return (
    <Text style={[styles.subtitle, { color: palette.mutedText }, style]}>
      {children}
    </Text>
  );
};

const TrayBody: React.FC<ITrayBody> & React.FunctionComponent<ITrayBody> = ({
  children,
  style,
}: ITrayBody): React.JSX.Element => (
  <View style={[styles.body, style]}>{children}</View>
);

const TrayFooter: React.FC<ITrayFooter> &
  React.FunctionComponent<ITrayFooter> = ({
  children,
  style,
}: ITrayFooter): React.JSX.Element => {
  const { palette } = useTrayContext("Tray.Footer");
  return (
    <View style={[styles.footer, { borderTopColor: palette.border }, style]}>
      {children}
    </View>
  );
};

const TrayClose: React.FC<ITrayClose> & React.FunctionComponent<ITrayClose> = ({
  children,
  style,
}: ITrayClose): React.JSX.Element => {
  const { close, palette } = useTrayContext("Tray.Close");
  const state = { color: palette.mutedText, size: 20 };
  const content =
    typeof children === "function" ? children(state) : (children ?? null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={12}
      onPress={close}
      style={style}
    >
      <TrayTintContext.Provider value={palette.mutedText}>
        {content ?? (
          <Text style={[styles.glyph, { color: palette.mutedText }]}>✕</Text>
        )}
      </TrayTintContext.Provider>
    </Pressable>
  );
};

const TrayBack: React.FC<ITrayBack> & React.FunctionComponent<ITrayBack> = ({
  children,
  style,
}: ITrayBack): React.JSX.Element | null => {
  const { goBack, canGoBack, palette } = useTrayContext("Tray.Back");
  if (!canGoBack) return null;

  const state = { color: palette.mutedText, size: 20 };
  const content =
    typeof children === "function" ? children(state) : (children ?? null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={12}
      onPress={goBack}
      style={style}
    >
      <TrayTintContext.Provider value={palette.mutedText}>
        {content ?? (
          <Text style={[styles.glyph, { color: palette.mutedText }]}>‹</Text>
        )}
      </TrayTintContext.Provider>
    </Pressable>
  );
};

const TrayScrollView: React.FC<ITrayScrollView> &
  React.FunctionComponent<ITrayScrollView> = ({
  children,
  maxHeight,
  contentContainerStyle,
  style,
}: ITrayScrollView): React.JSX.Element => {
  const { scrollY, isDragging, hasScrollable, offset, pan, motion } =
    useTrayContext("Tray.ScrollView");
  const { height: screenHeight } = useWindowDimensions();
  const listRef = useAnimatedRef<Animated.ScrollView>();
  const resolvedMax = maxHeight ?? screenHeight * 0.55;

  useEffect(() => {
    hasScrollable.value = true;
    return () => {
      hasScrollable.value = false;
      scrollY.value = 0;
    };
  }, [hasScrollable, scrollY]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      if (isDragging.value) {
        scrollTo(listRef, 0, 0, false);
        scrollY.value = 0;
        return;
      }
      scrollY.value = event.contentOffset.y;
    },
  });

  const nativeGesture = useMemo(
    () => Gesture.Native().simultaneousWithExternalGesture(pan),
    [pan],
  );

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        ref={listRef}
        style={[{ maxHeight: resolvedMax }, style]}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate={motion.scrollDeceleration}
        bounces={true}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  );
};

const TrayIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { palette } = useTrayContext("Tray.Icon");
  const color = useTrayTint(palette.text);
  return (
    <TrayTintContext.Provider value={color}>
      {children}
    </TrayTintContext.Provider>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  wrap: {
    paddingHorizontal: 10,
  },
  sheet: {
    borderWidth: StyleSheet.hairlineWidth,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  clip: {
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  measure: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  handleArea: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 2,
  },
  handle: {
    width: 38,
    height: 5,
    borderRadius: 3,
  },
  activeLayer: {
    width: "100%",
  },
  idleLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "600", flexShrink: 1 },
  subtitle: { fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 20, paddingBottom: 16 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  glyph: { fontSize: 18, fontWeight: "600" },
});

const Tray = createCompoundComponent("Tray", memo(TrayRoot), {
  Trigger: createCompoundComponent("Tray.Trigger", TrayTrigger),
  Content: createCompoundComponent("Tray.Content", TrayContent),
  View: createCompoundComponent("Tray.View", TrayView),
  Header: createCompoundComponent("Tray.Header", TrayHeader),
  Title: createCompoundComponent("Tray.Title", TrayTitle),
  Subtitle: createCompoundComponent("Tray.Subtitle", TraySubtitle),
  Body: createCompoundComponent("Tray.Body", TrayBody),
  Footer: createCompoundComponent("Tray.Footer", TrayFooter),
  Close: createCompoundComponent("Tray.Close", TrayClose),
  Back: createCompoundComponent("Tray.Back", TrayBack),
  ScrollView: createCompoundComponent("Tray.ScrollView", TrayScrollView),
  Icon: createCompoundComponent("Tray.Icon", TrayIcon),
});

export {
  Tray,
  TrayRoot,
  TrayTrigger,
  TrayContent,
  TrayView,
  TrayHeader,
  TrayTitle,
  TraySubtitle,
  TrayBody,
  TrayFooter,
  TrayClose,
  TrayBack,
  TrayScrollView,
  useTray,
};
export type {
  ITray,
  ITrayBody,
  ITrayClose,
  ITrayContent,
  ITrayFooter,
  ITrayHeader,
  ITrayMotion,
  ITrayPalette,
  ITrayScrollView,
  ITrayTitle,
  ITrayTrigger,
  ITrayView,
  TTrayDetent,
  TTrayTheme,
  TTrayViewAxis,
} from "./types";
export default Tray;
