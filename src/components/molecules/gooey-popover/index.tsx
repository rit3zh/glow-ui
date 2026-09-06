import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Blur,
  Canvas,
  ColorMatrix,
  Group,
  Paint,
  RoundedRect,
} from "@shopify/react-native-skia";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  DEFAULT_ALIGN,
  DEFAULT_COLOR,
  DEFAULT_GOO_STRENGTH,
  DEFAULT_PANEL_RADIUS,
  DEFAULT_PRESS_SCALE,
  DEFAULT_SIDE,
  DEFAULT_SIDE_OFFSET,
  GOO_CLOSE_SPRING,
  GOO_MATRIX,
  GOO_OPEN_SPRING,
  PRESS_IN_SPRING,
  PRESS_OUT_SPRING,
} from "./const";
import { GooeyPopoverContext, useGooeyPopover } from "./context";
import { buildGeo, rectAt } from "./geo";
import type {
  IGooeyPopoverContent,
  IGooeyPopoverRoot,
  IGooeyPopoverTrigger,
  ITriggerSize,
} from "./types";
import {
  useAnimatedRect,
  useMeasuredSize,
  usePopoverGeometry,
  useScaledTriggerRect,
} from "./hooks";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const MAX_PANEL_WIDTH = Math.min(SCREEN_W * 0.92, 320);

const GooeyPopoverRoot: React.FC<IGooeyPopoverRoot> &
  React.FunctionComponent<IGooeyPopoverRoot> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  side = DEFAULT_SIDE,
  align = DEFAULT_ALIGN,
  sideOffset = DEFAULT_SIDE_OFFSET,
  panelRadius = DEFAULT_PANEL_RADIUS,
  gooStrength = DEFAULT_GOO_STRENGTH,
  color = DEFAULT_COLOR,
  dismissOnOutsidePress = true,
  closeSpringConfig = GOO_CLOSE_SPRING,
  openSpringConfig = GOO_OPEN_SPRING,
  style,
}: IGooeyPopoverRoot): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolled, setUncontrolled] = useState<boolean>(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolled;

  const progress = useSharedValue<number>(defaultOpen ? 1 : 0);
  const triggerScale = useSharedValue<number>(1);
  const [triggerSize, setTriggerSize] = useState<ITriggerSize>({
    w: 0,
    h: 0,
  });

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);
  const openConfig = openSpringConfig ?? GOO_OPEN_SPRING;
  const closeConfig = closeSpringConfig ?? GOO_CLOSE_SPRING;
  const springConfig = open ? openConfig : closeConfig;
  useEffect(() => {
    progress.value = withSpring(open ? 1 : 0, springConfig);
  }, [open, progress]);

  const ctx = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      progress,
      side,
      align,
      gap: sideOffset,
      panelRadius,
      gooStrength,
      color,
      dismissOnOutsidePress,
      triggerSize,
      setTriggerSize,
      triggerScale,
    }),
    [
      open,
      setOpen,
      toggle,
      progress,
      side,
      align,
      sideOffset,
      panelRadius,
      gooStrength,
      color,
      dismissOnOutsidePress,
      triggerSize,
      triggerScale,
    ],
  );

  return (
    <GooeyPopoverContext.Provider value={ctx}>
      <View style={[styles.root, style]}>
        {open && dismissOnOutsidePress ? (
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        ) : null}
        {children}
      </View>
    </GooeyPopoverContext.Provider>
  );
};

const GooeyPopoverTrigger: React.FC<IGooeyPopoverTrigger> = ({
  children,
  style,
  pressScale = DEFAULT_PRESS_SCALE,
}: IGooeyPopoverTrigger): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const { toggle, open, setTriggerSize, triggerScale } = useGooeyPopover(
    "GooeyPopover.Trigger",
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      setTriggerSize({ w: width, h: height });
    },
    [setTriggerSize],
  );

  const onPressIn = useCallback(() => {
    triggerScale.value = withSpring(pressScale, PRESS_IN_SPRING);
  }, [triggerScale, pressScale]);

  const onPressOut = useCallback(() => {
    triggerScale.value = withSpring(1, PRESS_OUT_SPRING);
  }, [triggerScale]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: triggerScale.value }],
  }));

  return (
    <AnimatedPressable
      onLayout={onLayout}
      onPress={toggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      style={[styles.trigger, style, pressStyle]}
    >
      {typeof children === "string" ? (
        <Text style={styles.triggerText}>{children}</Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};

const GooeyPopoverContent: React.FC<IGooeyPopoverContent> &
  React.FunctionComponent<IGooeyPopoverContent> = ({
  children,
  style,
  textStyle,
}: IGooeyPopoverContent): React.JSX.Element => {
  const {
    progress,
    side,
    align,
    gap,
    panelRadius,
    gooStrength,
    color,
    open,
    triggerSize,
    triggerScale,
  } = useGooeyPopover("GooeyPopover.Content");

  const { size: contentSize, onLayout: onMeasure } = useMeasuredSize({
    w: 0,
    h: 0,
  });

  const geo = usePopoverGeometry(
    triggerSize,
    contentSize,
    side,
    align,
    gap,
    panelRadius,
  );
  const ready = geo.layerW > 0 && contentSize.w > 0;

  const { rx, ry, rw, rh, rr } = useAnimatedRect(geo, progress);
  const { tx, ty, tw, th, tr } = useScaledTriggerRect(geo, triggerScale);

  const clipStyle = useAnimatedStyle(() => {
    const m = rectAt(geo, progress.value);
    return {
      left: m.x,
      top: m.y,
      width: m.w,
      height: m.h,
      borderRadius: m.r,
    };
  }, [geo]);

  const contentStyle = useAnimatedStyle(() => {
    const m = rectAt(geo, progress.value);
    return {
      left: geo.panel.x - m.x,
      top: geo.panel.y - m.y,
      opacity: interpolate(progress.value, [0, 0.45, 1], [0, 0.2, 1]),
    };
  }, [geo]);

  const body =
    typeof children === "string" ? (
      <Text style={[styles.contentText, textStyle]}>{children}</Text>
    ) : (
      children
    );

  return (
    <>
      <View pointerEvents="none" style={styles.measure}>
        <View style={styles.panel} onLayout={onMeasure}>
          {body}
        </View>
      </View>

      {ready ? (
        <Canvas
          pointerEvents="none"
          style={[
            styles.gooLayer,
            {
              left: geo.left,
              top: geo.top,
              width: geo.layerW,
              height: geo.layerH,
            },
          ]}
        >
          <Group
            layer={
              <Paint>
                <Blur blur={gooStrength} />
                <ColorMatrix matrix={GOO_MATRIX} />
              </Paint>
            }
          >
            <RoundedRect
              x={tx}
              y={ty}
              width={tw}
              height={th}
              r={tr}
              color={color}
            />
            <RoundedRect
              x={rx}
              y={ry}
              width={rw}
              height={rh}
              r={rr}
              color={color}
            />
          </Group>
        </Canvas>
      ) : null}

      <View
        pointerEvents={open ? "box-none" : "none"}
        style={[
          styles.contentLayer,
          {
            left: geo.left,
            top: geo.top,
            width: geo.layerW,
            height: geo.layerH,
          },
        ]}
      >
        <Animated.View style={[styles.clip, clipStyle]}>
          <Animated.View style={[styles.panel, contentStyle, style]}>
            {body}
          </Animated.View>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  backdrop: {
    position: "absolute",
    left: -SCREEN_W,
    top: -SCREEN_H,
    width: SCREEN_W * 2,
    height: SCREEN_H * 2,
    zIndex: 5,
  },
  trigger: {
    zIndex: 1,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1d1d1f",
  },
  gooLayer: {
    position: "absolute",
    zIndex: 0,
  },
  contentLayer: {
    position: "absolute",
    zIndex: 10,
  },
  clip: {
    position: "absolute",
    overflow: "hidden",
  },
  panel: {
    position: "absolute",
    maxWidth: MAX_PANEL_WIDTH,
    padding: 16,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1d1d1f",
  },
  measure: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0,
    zIndex: -2,
  },
});

const GooeyPopover = Object.assign(GooeyPopoverRoot, {
  Root: GooeyPopoverRoot,
  Trigger: GooeyPopoverTrigger,
  Content: GooeyPopoverContent,
});

export { GooeyPopover };
export default GooeyPopover;
export type {
  IGooeyPopoverRoot,
  IGooeyPopoverTrigger,
  IGooeyPopoverContent,
} from "./types";
export { GooeyPopoverAlignment, GooeyPopoverSide } from "./types";
