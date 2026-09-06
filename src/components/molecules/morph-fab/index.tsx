// @ts-check
import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  Dimensions,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
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
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createCompoundComponent } from "@/utils/create-compound-component";

import {
  DEFAULT_ALIGN,
  DEFAULT_COLOR,
  DEFAULT_DIRECTION,
  DEFAULT_GOO_STRENGTH,
  DEFAULT_ITEM_GAP,
  DEFAULT_ITEM_PADDING,
  DEFAULT_ITEM_PRESS_SCALE,
  DEFAULT_ITEM_RADIUS,
  DEFAULT_PRESS_SCALE,
  DEFAULT_SIDE_OFFSET,
  DEFAULT_SPACING,
  DEFAULT_STAGGER,
  DEFAULT_TRIGGER_RADIUS,
  DEFAULT_TRIGGER_ROTATION,
  DEFAULT_TRIGGER_SIZE,
  GOO_MATRIX,
  MORPH_CLOSE_SPRING,
  MORPH_OPEN_SPRING,
  PRESS_IN_SPRING,
  PRESS_OUT_SPRING,
} from "./const";
import { MorphFabContext, useMorphFab } from "./context";
import { itemProgress } from "./geo";
import {
  useItemRegistry,
  useMeasuredSize,
  useMorphFabGeometry,
  useScaledFabRect,
  useSlotRect,
} from "./hooks";
import type {
  IMorphFabBlob,
  IMorphFabItem,
  IMorphFabItemIcon,
  IMorphFabItemLabel,
  IMorphFabRoot,
  IMorphFabTrigger,
} from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const MorphFabBlob = memo<IMorphFabBlob>(
  ({
    index,
    count,
    geo,
    progress,
    stagger,
    color,
  }: IMorphFabBlob): React.JSX.Element => {
    const { sx, sy, sw, sh, sr } = useSlotRect(
      geo,
      index,
      count,
      progress,
      stagger,
    );

    return (
      <RoundedRect x={sx} y={sy} width={sw} height={sh} r={sr} color={color} />
    );
  },
);

const MorphFabRoot: React.FC<IMorphFabRoot> &
  React.FunctionComponent<IMorphFabRoot> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  direction = DEFAULT_DIRECTION,
  align = DEFAULT_ALIGN,
  sideOffset = DEFAULT_SIDE_OFFSET,
  spacing = DEFAULT_SPACING,
  itemRadius = DEFAULT_ITEM_RADIUS,
  itemPadding = DEFAULT_ITEM_PADDING,
  itemGap = DEFAULT_ITEM_GAP,
  itemSize,
  itemColor,
  triggerRadius = DEFAULT_TRIGGER_RADIUS,
  triggerColor,
  gooStrength = DEFAULT_GOO_STRENGTH,
  color = DEFAULT_COLOR,
  stagger = DEFAULT_STAGGER,
  closeOnSelect = true,
  dismissOnOutsidePress = true,
  openSpringConfig = MORPH_OPEN_SPRING,
  closeSpringConfig = MORPH_CLOSE_SPRING,
  style,
}: IMorphFabRoot): React.JSX.Element & React.ReactNode & React.ReactElement => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolled, setUncontrolled] = useState<boolean>(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolled;

  const progress = useSharedValue<number>(defaultOpen ? 1 : 0);
  const triggerScale = useSharedValue<number>(1);
  const { size: triggerSize, onLayout: onTriggerLayout } = useMeasuredSize({
    w: 0,
    h: 0,
  });

  const { items, registerItem, unregisterItem, updateItem } = useItemRegistry();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const selectItem = useCallback(
    (value?: string, onSelect?: (value?: string) => void) => {
      onSelect?.(value);
      if (closeOnSelect) setOpen(false);
    },
    [closeOnSelect, setOpen],
  );

  useEffect(() => {
    progress.value = withSpring(
      open ? 1 : 0,
      open ? openSpringConfig : closeSpringConfig,
    );
  }, [open, progress, openSpringConfig, closeSpringConfig]);

  const geo = useMorphFabGeometry({
    triggerSize,
    items,
    direction,
    align,
    sideOffset,
    spacing,
    itemRadius,
    triggerRadius,
  });

  const { fx, fy, fw, fh, fr } = useScaledFabRect(geo, triggerScale);

  const ready =
    geo.layerW > 0 && items.every((item) => item.w > 0 && item.h > 0);

  const ctx = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      progress,
      triggerScale,
      triggerSize,
      items,
      registerItem,
      unregisterItem,
      updateItem,
      selectItem,
      geo,
      stagger,
      itemRadius,
      itemPadding,
      itemGap,
      itemSize,
      itemColor,
    }),
    [
      open,
      setOpen,
      toggle,
      progress,
      triggerScale,
      triggerSize,
      items,
      registerItem,
      unregisterItem,
      updateItem,
      selectItem,
      geo,
      stagger,
      itemRadius,
      itemPadding,
      itemGap,
      itemSize,
      itemColor,
    ],
  );

  return (
    <MorphFabContext.Provider value={ctx}>
      <View style={[styles.root, style]}>
        {open && dismissOnOutsidePress ? (
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        ) : null}

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
              transform={[{ translateX: -geo.left }, { translateY: -geo.top }]}
              layer={
                <Paint>
                  <Blur blur={gooStrength} />
                  <ColorMatrix matrix={GOO_MATRIX} />
                </Paint>
              }
            >
              <RoundedRect
                x={fx}
                y={fy}
                width={fw}
                height={fh}
                r={fr}
                color={triggerColor ?? color}
              />
              {items.map((item, index) => (
                <MorphFabBlob
                  key={item.id}
                  index={index}
                  count={items.length}
                  geo={geo}
                  progress={progress}
                  stagger={stagger}
                  color={item.color ?? itemColor ?? color}
                />
              ))}
            </Group>
          </Canvas>
        ) : null}

        <View
          pointerEvents="box-none"
          onLayout={onTriggerLayout}
          style={styles.anchor}
        >
          {children}
        </View>
      </View>
    </MorphFabContext.Provider>
  );
};

const MorphFabTrigger: React.FC<IMorphFabTrigger> = memo<IMorphFabTrigger>(
  ({
    children,
    size = DEFAULT_TRIGGER_SIZE,
    pressScale = DEFAULT_PRESS_SCALE,
    rotate = DEFAULT_TRIGGER_ROTATION,
    style,
  }: IMorphFabTrigger): React.JSX.Element & React.ReactNode => {
    const { toggle, open, progress, triggerScale } =
      useMorphFab("MorphFab.Trigger");

    const onPressIn = useCallback(() => {
      triggerScale.value = withSpring(pressScale, PRESS_IN_SPRING);
    }, [triggerScale, pressScale]);

    const onPressOut = useCallback(() => {
      triggerScale.value = withSpring(1, PRESS_OUT_SPRING);
    }, [triggerScale]);

    const pressStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
      transform: [{ scale: triggerScale.value }],
    }));

    const iconStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
      transform: [
        { rotate: `${interpolate(progress.value, [0, 1], [0, rotate])}deg` },
      ],
    }));

    return (
      <AnimatedPressable
        onPress={toggle}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={[
          styles.trigger,
          { width: size, height: size, borderRadius: size / 2 },
          style,
          pressStyle,
        ]}
      >
        <Animated.View style={iconStyle}>
          {children ?? (
            <View style={styles.plus}>
              <View style={[styles.plusBar, styles.plusBarHorizontal]} />
              <View style={[styles.plusBar, styles.plusBarVertical]} />
            </View>
          )}
        </Animated.View>
      </AnimatedPressable>
    );
  },
);

const MorphFabItem = memo<IMorphFabItem>(
  ({
    children,
    value,
    disabled = false,
    onSelect,
    size,
    radius,
    color,
    padding,
    gap,
    pressScale = DEFAULT_ITEM_PRESS_SCALE,
    style,
  }: IMorphFabItem): React.JSX.Element => {
    const id = useId();
    const {
      items,
      registerItem,
      unregisterItem,
      updateItem,
      selectItem,
      geo,
      progress,
      stagger,
      open,
      itemPadding,
      itemGap,
      itemSize,
      itemColor,
    } = useMorphFab("MorphFab.Item");

    const index = items.findIndex((item) => item.id === id);
    const count = items.length;
    const slot = index >= 0 ? geo.slots[index] : undefined;
    const pressed = useSharedValue<number>(0);

    const resolvedSize = size ?? itemSize;
    const resolvedPadding = padding ?? itemPadding;
    const resolvedGap = gap ?? itemGap;
    const resolvedColor = color ?? itemColor;

    useEffect(() => {
      registerItem(id);
      return () => unregisterItem(id);
    }, [id, registerItem, unregisterItem]);

    useEffect(() => {
      updateItem(id, { radius, color: resolvedColor });
    }, [id, updateItem, radius, resolvedColor]);

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        updateItem(id, { w: width, h: height });
      },
      [id, updateItem],
    );

    const animatedStyle = useAnimatedStyle(() => {
      const t =
        index < 0 ? 0 : itemProgress(progress.value, index, count, stagger);
      const target = geo.slots[index] ?? geo.fab;
      const dx = geo.fab.x + geo.fab.w / 2 - (target.x + target.w / 2);
      const dy = geo.fab.y + geo.fab.h / 2 - (target.y + target.h / 2);

      return {
        opacity: interpolate(t, [0, 0.55, 1], [0, 0, 1], Extrapolation.CLAMP),
        transform: [
          { translateX: dx * (1 - t) },
          { translateY: dy * (1 - t) },
          {
            scale:
              interpolate(t, [0, 1], [0.6, 1], Extrapolation.CLAMP) *
              interpolate(pressed.value, [0, 1], [1, pressScale]),
          },
        ],
      };
    }, [geo, index, count, stagger, pressScale]);

    const handlePress = useCallback(
      () => selectItem(value, onSelect),
      [selectItem, value, onSelect],
    );

    const handlePressIn = useCallback(() => {
      pressed.value = withSpring(1, PRESS_IN_SPRING);
    }, [pressed]);

    const handlePressOut = useCallback(() => {
      pressed.value = withSpring(0, PRESS_OUT_SPRING);
    }, [pressed]);

    return (
      <AnimatedPressable
        onLayout={onLayout}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || !open}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        pointerEvents={open ? "auto" : "none"}
        style={[
          styles.item,
          {
            left: slot?.x ?? 0,
            top: slot?.y ?? 0,
            padding: resolvedPadding,
            gap: resolvedGap,
          },
          resolvedSize
            ? { width: resolvedSize, height: resolvedSize, padding: 0 }
            : null,
          style,
          animatedStyle,
        ]}
      >
        {children}
      </AnimatedPressable>
    );
  },
);

const MorphFabItemIcon = memo<IMorphFabItemIcon>(
  ({ children, style }: IMorphFabItemIcon): React.JSX.Element => (
    <View style={[styles.itemIcon, style]}>{children}</View>
  ),
);

const MorphFabItemLabel = memo<IMorphFabItemLabel>(
  ({ children, style }: IMorphFabItemLabel): React.JSX.Element => (
    <Text style={[styles.itemLabel, style]} numberOfLines={1}>
      {children}
    </Text>
  ),
);

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
  gooLayer: {
    position: "absolute",
    zIndex: 0,
  },
  anchor: {
    alignSelf: "flex-start",
    zIndex: 10,
  },
  trigger: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  plus: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  plusBar: {
    position: "absolute",
    backgroundColor: "#1d1d1f",
    borderRadius: 2,
  },
  plusBarHorizontal: {
    width: 22,
    height: 2.5,
  },
  plusBarVertical: {
    width: 2.5,
    height: 22,
  },
  item: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  itemIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1d1d1f",
    flexShrink: 0,
  },
});

createCompoundComponent("MorphFab.Blob", MorphFabBlob);

const Root = createCompoundComponent("MorphFab.Root", MorphFabRoot);
const Trigger = createCompoundComponent("MorphFab.Trigger", MorphFabTrigger);
const ItemIcon = createCompoundComponent("MorphFab.ItemIcon", MorphFabItemIcon);
const ItemLabel = createCompoundComponent(
  "MorphFab.ItemLabel",
  MorphFabItemLabel,
);
const Item = createCompoundComponent("MorphFab.Item", MorphFabItem, {
  Icon: ItemIcon,
  Label: ItemLabel,
});

const MorphFab = createCompoundComponent("MorphFab", Root, {
  Root,
  Trigger,
  Item,
  ItemIcon,
  ItemLabel,
});

export { MorphFab };
export default MorphFab;
export type {
  IMorphFabRoot,
  IMorphFabTrigger,
  IMorphFabItem,
  IMorphFabItemIcon,
  IMorphFabItemLabel,
} from "./types";
export { MorphFabAlignment, MorphFabDirection } from "./types";
