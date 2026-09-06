// @ts-check
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import {
  CLOSE_DURATION,
  CLOSE_EASING,
  CONTENT_FADE_END,
  CONTENT_FADE_START,
  DEFAULT_COLUMNS,
  DEFAULT_ICON_SIZE,
  DEFAULT_PANEL_WIDTH_RATIO,
  DEFAULT_RADIUS,
  DEFAULT_SCREEN_MARGIN,
  HANDOFF_CLOSE_DURATION,
  HANDOFF_DELAY,
  HANDOFF_DURATION,
  HANDOFF_EASING,
  MAX_PANEL_WIDTH,
  ITEM_SCALE_FROM,
  ITEM_WINDOW,
  MORPH_CLOSE_TIMING,
  MORPH_LABEL_FADE_END,
  MORPH_LABEL_SCALE_TO,
  MORPH_PUSH_DISTANCE,
  MORPH_TIMING,
  MORPH_TITLE_FADE_START,
  MORPH_TITLE_SCALE_FROM,
  PALETTES,
  PRESS_SCALE,
  PRESS_TIMING,
  REVEAL_DELAY,
  REVEAL_DURATION,
  REVEAL_EASING,
  STAGGER_SPAN,
  TRIGGER_ICON_FADE_END,
} from "./const";
import {
  UnfoldMenuContext,
  UnfoldMenuGridContext,
  UnfoldMenuMorphContext,
  UnfoldMenuOffsetContext,
  UnfoldMenuSlotContext,
  UnfoldMenuTintContext,
  useUnfoldMenu,
  useUnfoldMenuGrid,
  useUnfoldMenuMorph,
  useUnfoldMenuOffset,
  useUnfoldMenuSlot,
  useUnfoldMenuTint,
} from "./context";
import type {
  IUnfoldMenu,
  IUnfoldMenuClose,
  IUnfoldMenuContent,
  IUnfoldMenuContext,
  IUnfoldMenuGrid,
  IUnfoldMenuHeader,
  IUnfoldMenuIcon,
  IUnfoldMenuItem,
  IUnfoldMenuLabel,
  IUnfoldMenuMorph,
  IUnfoldMenuPalette,
  IUnfoldMenuPoint,
  IUnfoldMenuTitle,
  IUnfoldMenuTrigger,
} from "./types";
import { clampToScreen } from "./helper";
import { createCompoundComponent } from "@/utils/create-compound-component";

const UnfoldMenuRoot: React.FC<IUnfoldMenu> &
  React.FunctionComponent<IUnfoldMenu> = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  closeOnSelect = true,
  panelWidth: panelWidthProp,
  screenMargin = DEFAULT_SCREEN_MARGIN,
  radius = DEFAULT_RADIUS,
  iconSize = DEFAULT_ICON_SIZE,
  theme = "light",
  palette: paletteProp,
  style,
}: IUnfoldMenu): React.JSX.Element => {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const open = isControlled ? (openProp as boolean) : internalOpen;

  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const progress = useSharedValue<number>(open ? 1 : 0);
  const reveal = useSharedValue<number>(open ? 1 : 0);
  const handoff = useSharedValue<number>(open ? 1 : 0);
  const labelOrigin = useSharedValue<IUnfoldMenuPoint>({ x: 0, y: 0 });
  const titleOrigin = useSharedValue<IUnfoldMenuPoint>({ x: 0, y: 0 });

  const anchorRef = useRef<View>(null);
  const [anchorRect, setAnchorRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [panelHeight, setPanelHeight] = useState(0);
  const [mounted, setMounted] = useState<boolean>(open);
  const [presented, setPresented] = useState<boolean>(open);

  const panelWidth = Math.min(
    panelWidthProp ?? screenWidth * DEFAULT_PANEL_WIDTH_RATIO,
    screenWidth - screenMargin * 2,
    panelWidthProp ?? MAX_PANEL_WIDTH,
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const requestOpen = useCallback(() => {
    const node = anchorRef.current;
    if (!node) {
      setOpen(true);
      return;
    }
    node.measureInWindow((x, y, w, h) => {
      setAnchorRect({ x, y, w, h });
      setOpen(true);
    });
  }, [setOpen]);

  const select = useCallback(
    (value?: string) => {
      onSelect?.(value);
      if (closeOnSelect) setOpen(false);
    },
    [onSelect, closeOnSelect, setOpen],
  );

  const registerPanel = useCallback((h: number) => {
    setPanelHeight((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, []);

  const registerLabelOrigin = useCallback(
    (point: IUnfoldMenuPoint) => {
      labelOrigin.value = point;
    },
    [labelOrigin],
  );

  const registerTitleOrigin = useCallback(
    (point: IUnfoldMenuPoint) => {
      titleOrigin.value = point;
    },
    [titleOrigin],
  );

  useEffect(() => {
    if (!open) return;
    setMounted(true);

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPresented(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open]);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = open ? 1 : 0;
      reveal.value = open ? 1 : 0;
      handoff.value = open ? 1 : 0;
      if (!open) setMounted(false);
      return;
    }
    if (open) {
      if (!presented) return;
      progress.value = withSpring(1, MORPH_TIMING);
      reveal.value = withDelay(
        REVEAL_DELAY,
        withTiming(1, { duration: REVEAL_DURATION, easing: REVEAL_EASING }),
      );
      handoff.value = withDelay(
        HANDOFF_DELAY,
        withTiming(1, { duration: HANDOFF_DURATION, easing: HANDOFF_EASING }),
      );
      return;
    }
    reveal.value = withTiming(0, {
      duration: CLOSE_DURATION,
      easing: CLOSE_EASING,
    });
    handoff.value = withTiming(0, {
      duration: HANDOFF_CLOSE_DURATION,
      easing: HANDOFF_EASING,
    });
    progress.value = withSpring(0, MORPH_CLOSE_TIMING, (finished) => {
      "worklet";
      if (finished) {
        scheduleOnRN(setMounted, false);
        scheduleOnRN(setPresented, false);
      }
    });
  }, [open, presented, reduceMotion, progress, reveal, handoff]);

  const palette = useMemo<IUnfoldMenuPalette>(
    () => ({ ...PALETTES[theme], ...paletteProp }),
    [theme, paletteProp],
  );

  const panelHeightResolved = panelHeight || anchorRect.h;
  const target = clampToScreen(
    anchorRect,
    panelWidth,
    panelHeightResolved,
    screenWidth,
    screenHeight,
    screenMargin,
    insets.top,
    insets.bottom,
  );

  const panelOrigin = useMemo(
    () => ({ x: target.left, y: target.top }),
    [target.left, target.top],
  );

  const ctx = useMemo<IUnfoldMenuContext>(
    () => ({
      open,
      overlayVisible: mounted,
      requestOpen,
      setOpen,
      select,
      progress,
      reveal,
      handoff,
      panelWidth,
      registerPanel,
      anchorRect,
      panelOrigin,
      labelOrigin,
      titleOrigin,
      registerLabelOrigin,
      registerTitleOrigin,
      palette,
      iconSize,
      reduceMotion,
    }),
    [
      open,
      mounted,
      requestOpen,
      setOpen,
      select,
      progress,
      reveal,
      handoff,
      panelWidth,
      registerPanel,
      anchorRect,
      panelOrigin,
      labelOrigin,
      titleOrigin,
      registerLabelOrigin,
      registerTitleOrigin,
      palette,
      iconSize,
      reduceMotion,
    ],
  );
  const morphStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: interpolate(p, [0, 1], [anchorRect.x, target.left]) },
        { translateY: interpolate(p, [0, 1], [anchorRect.y, target.top]) },
      ],
      width: interpolate(p, [0, 1], [anchorRect.w, panelWidth]),
      height: interpolate(p, [0, 1], [anchorRect.h, panelHeightResolved]),
    };
  });

  const morphSurface = useMemo<ViewStyle>(
    () => ({
      backgroundColor: palette.surface,
      borderColor: palette.border,
      borderRadius: radius,
    }),
    [palette, radius],
  );

  return (
    <UnfoldMenuContext.Provider value={ctx}>
      <View style={style}>
        <View ref={anchorRef} collapsable={false} style={styles.anchor}>
          <UnfoldMenuSlotContext.Provider value="anchor">
            {children}
          </UnfoldMenuSlotContext.Provider>
        </View>
      </View>

      {mounted ? (
        <Modal
          transparent
          statusBarTranslucent
          visible
          animationType="none"
          onRequestClose={() => setOpen(false)}
          onShow={() => setPresented(true)}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
          />
          <Animated.View
            pointerEvents="box-none"
            style={[styles.morph, morphSurface, morphStyle]}
          >
            <UnfoldMenuSlotContext.Provider value="overlay">
              {children}
            </UnfoldMenuSlotContext.Provider>
          </Animated.View>

          {/*
            The travelling trigger lives outside the panel: the panel resizes
            every frame, and anything inside it gets re-laid out (text
            re-measured) along with it. Out here its layout is computed once
            and only the transform moves.
          */}
          <UnfoldMenuSlotContext.Provider value="float">
            {children}
          </UnfoldMenuSlotContext.Provider>
        </Modal>
      ) : null}
    </UnfoldMenuContext.Provider>
  );
};

const UnfoldMenuTrigger: React.FC<IUnfoldMenuTrigger> &
  React.FunctionComponent<IUnfoldMenuTrigger> = ({
  children,
  style,
}: IUnfoldMenuTrigger): React.JSX.Element | null => {
  const {
    open,
    overlayVisible,
    requestOpen,
    progress,
    handoff,
    palette,
    reduceMotion,
    anchorRect,
    panelOrigin,
    labelOrigin,
    titleOrigin,
    registerLabelOrigin,
  } = useUnfoldMenu("UnfoldMenu.Trigger");
  const slot = useUnfoldMenuSlot();
  const pressed = useSharedValue<number>(0);

  const travelStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const toX = panelOrigin.x + titleOrigin.value.x - labelOrigin.value.x;
    const toY = panelOrigin.y + titleOrigin.value.y - labelOrigin.value.y;
    return {
      transform: [
        { translateX: interpolate(p, [0, 1], [anchorRect.x, toX]) },
        { translateY: interpolate(p, [0, 1], [anchorRect.y, toY]) },
      ],
    };
  });

  const morphIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, TRIGGER_ICON_FADE_END],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const morphLabelStyle = useAnimatedStyle(() => {
    const h = handoff.value;
    return {
      opacity: interpolate(
        h,
        [0, MORPH_LABEL_FADE_END],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transformOrigin: "left center",
      transform: [
        {
          translateX: interpolate(
            h,
            [0, MORPH_LABEL_FADE_END],
            [0, -MORPH_PUSH_DISTANCE],
            Extrapolation.CLAMP,
          ),
        },

        {
          scale: interpolate(
            h,
            [0, MORPH_LABEL_FADE_END],
            [1, MORPH_LABEL_SCALE_TO],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const morph = useMemo(
    () => ({ iconStyle: morphIconStyle, labelStyle: morphLabelStyle }),
    [morphIconStyle, morphLabelStyle],
  );

  const onLabelLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, y } = e.nativeEvent.layout;
      registerLabelOrigin({ x, y });
    },
    [registerLabelOrigin],
  );

  const measurer = useMemo<IUnfoldMenuMorph>(
    () => ({ onLabelLayout }),
    [onLabelLayout],
  );

  const pressStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - (1 - PRESS_SCALE) * (reduceMotion ? 0 : pressed.value) },
    ],
  }));

  if (slot === "overlay") return null;

  if (slot === "float") {
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.trigger,
          styles.bareTrigger,
          styles.floatTrigger,
          style,
          travelStyle,
        ]}
      >
        <UnfoldMenuMorphContext.Provider value={morph}>
          <UnfoldMenuTintContext.Provider value={palette.text}>
            {children}
          </UnfoldMenuTintContext.Provider>
        </UnfoldMenuMorphContext.Provider>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={pressStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={requestOpen}
        onPressIn={() => {
          pressed.value = withTiming(1, PRESS_TIMING);
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, PRESS_TIMING);
        }}
        style={[
          styles.trigger,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
          style,
          overlayVisible ? styles.handedOff : null,
        ]}
      >
        <UnfoldMenuMorphContext.Provider value={measurer}>
          <UnfoldMenuTintContext.Provider value={palette.text}>
            {children}
          </UnfoldMenuTintContext.Provider>
        </UnfoldMenuMorphContext.Provider>
      </Pressable>
    </Animated.View>
  );
};

const UnfoldMenuContent: React.FC<IUnfoldMenuContent> &
  React.FunctionComponent<IUnfoldMenuContent> = ({
  children,
  style,
}: IUnfoldMenuContent): React.JSX.Element | null => {
  const { open, progress, panelWidth, registerPanel } =
    useUnfoldMenu("UnfoldMenu.Content");
  const slot = useUnfoldMenuSlot();

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => registerPanel(e.nativeEvent.layout.height),
    [registerPanel],
  );

  const layerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [CONTENT_FADE_START, CONTENT_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  if (slot === "anchor") {
    return (
      <View
        pointerEvents="none"
        onLayout={onLayout}
        style={[styles.measurer, { width: panelWidth }]}
      >
        {children}
      </View>
    );
  }

  if (slot === "float") return null;

  return (
    <Animated.View
      pointerEvents={open ? "auto" : "none"}
      style={[styles.contentLayer, { width: panelWidth }, layerStyle, style]}
    >
      {children}
    </Animated.View>
  );
};

const UnfoldMenuHeader: React.FC<IUnfoldMenuHeader> &
  React.FunctionComponent<IUnfoldMenuHeader> = ({
  children,
  style,
}: IUnfoldMenuHeader): React.JSX.Element => {
  const { palette } = useUnfoldMenu("UnfoldMenu.Header");
  const slot = useUnfoldMenuSlot();
  const [offset, setOffset] = useState<IUnfoldMenuPoint>({ x: 0, y: 0 });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { x, y } = e.nativeEvent.layout;
    setOffset((prev) => (prev.x === x && prev.y === y ? prev : { x, y }));
  }, []);

  return (
    <View
      onLayout={slot === "anchor" ? onLayout : undefined}
      style={[styles.header, { borderBottomColor: palette.border }, style]}
    >
      <UnfoldMenuOffsetContext.Provider value={offset}>
        {children}
      </UnfoldMenuOffsetContext.Provider>
    </View>
  );
};

const UnfoldMenuTitle: React.FC<IUnfoldMenuTitle> &
  React.FunctionComponent<IUnfoldMenuTitle> = ({
  children,
  style,
}: IUnfoldMenuTitle): React.JSX.Element => {
  const { palette, handoff, registerTitleOrigin } =
    useUnfoldMenu("UnfoldMenu.Title");
  const offset = useUnfoldMenuOffset();
  const slot = useUnfoldMenuSlot();
  const [local, setLocal] = useState<IUnfoldMenuPoint | null>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { x, y } = e.nativeEvent.layout;
    setLocal((prev) =>
      prev && prev.x === x && prev.y === y ? prev : { x, y },
    );
  }, []);

  useEffect(() => {
    if (!local) return;
    registerTitleOrigin({ x: offset.x + local.x, y: offset.y + local.y });
  }, [local, offset.x, offset.y, registerTitleOrigin]);

  const fadeStyle = useAnimatedStyle(() => {
    const h = handoff.value;
    return {
      opacity: interpolate(
        h,
        [MORPH_TITLE_FADE_START, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transformOrigin: "left center",
      transform: [
        {
          translateX: interpolate(
            h,
            [MORPH_TITLE_FADE_START, 1],
            [MORPH_PUSH_DISTANCE, 0],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            h,
            [MORPH_TITLE_FADE_START, 1],
            [MORPH_TITLE_SCALE_FROM, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.Text
      onLayout={slot === "anchor" ? onLayout : undefined}
      style={[
        styles.title,
        { color: palette.mutedText },
        style,
        slot === "overlay" ? fadeStyle : null,
      ]}
    >
      {children}
    </Animated.Text>
  );
};

const UnfoldMenuClose: React.FC<IUnfoldMenuClose> &
  React.FunctionComponent<IUnfoldMenuClose> = ({
  children,
  style,
}: IUnfoldMenuClose): React.JSX.Element => {
  const { setOpen, palette, iconSize } = useUnfoldMenu("UnfoldMenu.Close");
  const state = { color: palette.mutedText, size: iconSize };
  const content =
    typeof children === "function" ? children(state) : (children ?? null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close menu"
      hitSlop={10}
      onPress={() => setOpen(false)}
      style={style}
    >
      <UnfoldMenuTintContext.Provider value={palette.mutedText}>
        {content ?? (
          <Text style={[styles.closeGlyph, { color: palette.mutedText }]}>
            ✕
          </Text>
        )}
      </UnfoldMenuTintContext.Provider>
    </Pressable>
  );
};

const UnfoldMenuGrid: React.FC<IUnfoldMenuGrid> &
  React.FunctionComponent<IUnfoldMenuGrid> = ({
  children,
  columns = DEFAULT_COLUMNS,
  style,
}: IUnfoldMenuGrid): React.JSX.Element => {
  const items = React.Children.toArray(children);
  return (
    <View style={[styles.grid, style]}>
      {items.map((child, index) => (
        <UnfoldMenuGridContext.Provider
          key={index}
          value={{ index, count: items.length, columns }}
        >
          {child}
        </UnfoldMenuGridContext.Provider>
      ))}
    </View>
  );
};

const UnfoldMenuItem: React.FC<IUnfoldMenuItem> &
  React.FunctionComponent<IUnfoldMenuItem> = ({
  children,
  value,
  onPress,
  disabled = false,
  style,
}: IUnfoldMenuItem): React.JSX.Element => {
  const { select, reveal, palette, reduceMotion } =
    useUnfoldMenu("UnfoldMenu.Item");
  const { index, count, columns } = useUnfoldMenuGrid("UnfoldMenu.Item");

  const rows = Math.ceil(count / columns);
  const col = index % columns;
  const row = Math.floor(index / columns);
  const maxDistance = Math.hypot((columns - 1) / 2, (rows - 1) / 2) || 1;
  const distance = Math.hypot(col - (columns - 1) / 2, row - (rows - 1) / 2);
  const start = (distance / maxDistance) * STAGGER_SPAN;

  const itemStyle = useAnimatedStyle(() => {
    if (reduceMotion) return { opacity: reveal.value, transform: [] };
    const t = interpolate(
      reveal.value,
      [start, start + ITEM_WINDOW],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: t,
      transform: [{ scale: ITEM_SCALE_FROM + (1 - ITEM_SCALE_FROM) * t }],
    };
  });

  const handlePress = useCallback(() => {
    onPress?.();
    select(value);
  }, [onPress, select, value]);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.item,
        {
          width: `${100 / columns}%`,
          borderRightWidth: col === columns - 1 ? 0 : StyleSheet.hairlineWidth,
          borderBottomWidth: row === rows - 1 ? 0 : StyleSheet.hairlineWidth,
          borderColor: palette.border,
        },
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Animated.View style={[styles.itemInner, itemStyle]}>
        <UnfoldMenuTintContext.Provider value={palette.mutedText}>
          {children}
        </UnfoldMenuTintContext.Provider>
      </Animated.View>
    </Pressable>
  );
};

const UnfoldMenuIcon: React.FC<IUnfoldMenuIcon> &
  React.FunctionComponent<IUnfoldMenuIcon> = ({
  children,
  style,
}: IUnfoldMenuIcon): React.JSX.Element => {
  const { palette, iconSize } = useUnfoldMenu("UnfoldMenu.Icon");
  const color = useUnfoldMenuTint(palette.text);
  const morph = useUnfoldMenuMorph();
  const content =
    typeof children === "function"
      ? children({ color, size: iconSize })
      : children;

  return (
    <Animated.View
      style={[
        styles.icon,
        { width: iconSize, height: iconSize },
        style,
        morph?.iconStyle,
      ]}
    >
      {content}
    </Animated.View>
  );
};

const UnfoldMenuLabel: React.FC<IUnfoldMenuLabel> &
  React.FunctionComponent<IUnfoldMenuLabel> = ({
  children,
  style,
}: IUnfoldMenuLabel): React.JSX.Element => {
  const { palette } = useUnfoldMenu("UnfoldMenu.Label");
  const color = useUnfoldMenuTint(palette.text);
  const morph = useUnfoldMenuMorph();

  return (
    <Animated.Text
      numberOfLines={1}
      onLayout={morph?.onLabelLayout}
      style={[styles.label, { color }, style, morph?.labelStyle]}
    >
      {children}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  anchor: {
    alignSelf: "flex-start",
  },
  morph: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  measurer: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
  },
  handedOff: {
    opacity: 0,
  },
  floatTrigger: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  bareTrigger: {
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    height: 44,
    minWidth: 144,
    borderRadius: DEFAULT_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
  },
  contentLayer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  closeGlyph: {
    fontSize: 14,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 22,
  },
  itemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.4,
  },
});

const UnfoldMenu = createCompoundComponent("UnfoldMenu", memo(UnfoldMenuRoot), {
  Trigger: createCompoundComponent("UnfoldMenu.Trigger", UnfoldMenuTrigger),
  Content: createCompoundComponent("UnfoldMenu.Content", UnfoldMenuContent),
  Header: createCompoundComponent("UnfoldMenu.Header", UnfoldMenuHeader),
  Title: createCompoundComponent("UnfoldMenu.Title", UnfoldMenuTitle),
  Close: createCompoundComponent("UnfoldMenu.Close", UnfoldMenuClose),
  Grid: createCompoundComponent("UnfoldMenu.Grid", UnfoldMenuGrid),
  Item: createCompoundComponent("UnfoldMenu.Item", UnfoldMenuItem),
  Icon: createCompoundComponent("UnfoldMenu.Icon", UnfoldMenuIcon),
  Label: createCompoundComponent("UnfoldMenu.Label", UnfoldMenuLabel),
});

export {
  UnfoldMenu,
  UnfoldMenuRoot,
  UnfoldMenuTrigger,
  UnfoldMenuContent,
  UnfoldMenuHeader,
  UnfoldMenuTitle,
  UnfoldMenuClose,
  UnfoldMenuGrid,
  UnfoldMenuItem,
  UnfoldMenuIcon,
  UnfoldMenuLabel,
};
export type {
  IUnfoldMenu,
  IUnfoldMenuClose,
  IUnfoldMenuContent,
  IUnfoldMenuGrid,
  IUnfoldMenuHeader,
  IUnfoldMenuIcon,
  IUnfoldMenuItem,
  IUnfoldMenuLabel,
  IUnfoldMenuPalette,
  IUnfoldMenuTitle,
  IUnfoldMenuTrigger,
  TUnfoldMenuTheme,
} from "./types";
export default UnfoldMenu;
