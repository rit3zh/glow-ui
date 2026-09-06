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
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  DEFAULT_FONT_SIZE,
  DEFAULT_GAP,
  DEFAULT_HEIGHT,
  DEFAULT_ICON_SIZE,
  DEFAULT_PADDING,
  DEFAULT_TRIGGER_GAP,
  DEFAULT_TRIGGER_PADDING_X,
  FOLLOW_DAMPING,
  FOLLOW_STIFFNESS,
  MAX_FRAME_SECONDS,
  PALETTES,
  PILL_SPRING,
  PRESS_GROW,
  PRESS_SPRING,
} from "./const";
import {
  MaskedTabBarContext,
  MaskedTabLayerContext,
  useMaskedTabBar,
  useMaskedTabLayer,
} from "./context";
import type {
  IMaskedTabBarContext,
  IMaskedTabBarIcon,
  IMaskedTabBarLabel,
  IMaskedTabBarList,
  IMaskedTabBarPalette,
  IMaskedTabBarRoot,
  IMaskedTabBarTrigger,
  IMaskedTabBox,
  IMaskedTabBoxEntry,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

function clampValue(value: number, min: number, max: number): number {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

function boxAtX(
  list: IMaskedTabBoxEntry[],
  x: number,
): IMaskedTabBoxEntry | null {
  "worklet";
  for (let i = 0; i < list.length; i += 1) {
    const box = list[i];
    if (x >= box.x && x <= box.x + box.width) {
      return box.disabled ? null : box;
    }
  }
  return null;
}

/** The trigger whose centre is closest to `center` — used when releasing. */
function nearestBox(
  list: IMaskedTabBoxEntry[],
  center: number,
): IMaskedTabBoxEntry | null {
  "worklet";
  let best: IMaskedTabBoxEntry | null = null;
  let bestDistance = Number.MAX_VALUE;
  for (let i = 0; i < list.length; i += 1) {
    const box = list[i];
    if (box.disabled) continue;
    const distance = Math.abs(box.x + box.width / 2 - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = box;
    }
  }
  return best;
}

const MaskedTabBarRoot: React.FC<IMaskedTabBarRoot> &
  React.FunctionComponent<IMaskedTabBarRoot> = ({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  theme = "light",
  palette: paletteProp,
  height = DEFAULT_HEIGHT,
  radius,
  padding = DEFAULT_PADDING,
  gap = DEFAULT_GAP,
  iconSize = DEFAULT_ICON_SIZE,
  fontSize = DEFAULT_FONT_SIZE,
  fontWeight = "600",
  draggable = true,
  style,
}: IMaskedTabBarRoot): React.JSX.Element => {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? "",
  );
  const value = isControlled ? (valueProp as string) : internalValue;

  const [boxMap, setBoxMap] = useState<
    Record<string, IMaskedTabBox & { disabled: boolean }>
  >({});
  const [listWidth, setListWidth] = useState<number>(0);

  const pillX = useSharedValue<number>(0);
  const pillWidth = useSharedValue<number>(0);
  const press = useSharedValue<number>(0);
  const grabbed = useSharedValue<boolean>(false);

  const palette = useMemo<IMaskedTabBarPalette>(
    () => ({ ...PALETTES[theme], ...paletteProp }),
    [theme, paletteProp],
  );

  const setValue = useCallback(
    (next: string) => {
      if (next === value) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange],
  );

  const registerTrigger = useCallback(
    (key: string, box: IMaskedTabBox, disabled: boolean) => {
      setBoxMap((prev) => {
        const current = prev[key];
        if (
          current &&
          current.disabled === disabled &&
          Math.abs(current.x - box.x) < 0.5 &&
          Math.abs(current.width - box.width) < 0.5
        ) {
          return prev;
        }
        return { ...prev, [key]: { ...box, disabled } };
      });
    },
    [],
  );

  const boxes = useMemo<IMaskedTabBoxEntry[]>(
    () =>
      Object.entries(boxMap)
        .map(([key, box]) => ({ ...box, value: key }))
        .sort((a, b) => a.x - b.x),
    [boxMap],
  );

  useEffect(() => {
    if (value || boxes.length === 0) return;
    setValue(boxes[0].value);
  }, [value, boxes, setValue]);

  const activeBox = boxMap[value];
  const placedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!activeBox) return;
    if (grabbed.value) return;
    if (!placedRef.current) {
      placedRef.current = true;
      pillX.value = activeBox.x;
      pillWidth.value = activeBox.width;
      return;
    }
    pillX.value = withSpring(activeBox.x, PILL_SPRING);
    pillWidth.value = withSpring(activeBox.width, PILL_SPRING);
  }, [activeBox, pillX, pillWidth, grabbed]);

  const ctx = useMemo<IMaskedTabBarContext>(
    () => ({
      value,
      setValue,
      registerTrigger,
      boxes,
      listWidth,
      setListWidth,
      pillX,
      pillWidth,
      press,
      grabbed,
      palette,
      height,
      radius: radius ?? height / 2,
      padding,
      gap,
      iconSize,
      fontSize,
      fontWeight,
      draggable,
    }),
    [
      value,
      setValue,
      registerTrigger,
      boxes,
      listWidth,
      pillX,
      pillWidth,
      press,
      grabbed,
      palette,
      height,
      radius,
      padding,
      gap,
      iconSize,
      fontSize,
      fontWeight,
      draggable,
    ],
  );

  return (
    <MaskedTabBarContext.Provider value={ctx}>
      <View
        style={[
          styles.root,
          {
            height,
            borderRadius: radius ?? height / 2,
            backgroundColor: palette.track,
            padding,
          },
          style,
        ]}
      >
        {children}
      </View>
    </MaskedTabBarContext.Provider>
  );
};

const MaskedTabBarList: React.FC<IMaskedTabBarList> &
  React.FunctionComponent<IMaskedTabBarList> = ({
  children,
  style,
}: IMaskedTabBarList): React.JSX.Element => {
  const {
    boxes,
    setValue,
    setListWidth,
    listWidth,
    pillX,
    pillWidth,
    press,
    grabbed,
    palette,
    radius,
    padding,
    gap,
    draggable,
  } = useMaskedTabBar("MaskedTabBar.List");

  const boxesValue = useSharedValue<IMaskedTabBoxEntry[]>([]);
  useEffect(() => {
    boxesValue.value = boxes;
  }, [boxes, boxesValue]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setListWidth(e.nativeEvent.layout.width),
    [setListWidth],
  );
  const grabOffset = useSharedValue<number>(0);
  const dragTarget = useSharedValue<number>(0);
  const dragVelocity = useSharedValue<number>(0);
  const hoveredValue = useSharedValue<string>("");
  const listWidthValue = useSharedValue<number>(0);

  useEffect(() => {
    listWidthValue.value = listWidth;
  }, [listWidth, listWidthValue]);

  const follow = useFrameCallback((frame) => {
    if (!grabbed.value) return;
    const dt = Math.min(
      (frame.timeSincePreviousFrame ?? 16) / 1000,
      MAX_FRAME_SECONDS,
    );
    const displacement = dragTarget.value - pillX.value;
    const velocity =
      dragVelocity.value +
      (FOLLOW_STIFFNESS * displacement - FOLLOW_DAMPING * dragVelocity.value) *
        dt;
    dragVelocity.value = velocity;
    pillX.value = pillX.value + velocity * dt;
  }, false);

  const setFollowActive = useCallback(
    (active: boolean) => follow.setActive(active),
    [follow],
  );

  useAnimatedReaction(
    () => grabbed.value,
    (isGrabbed, wasGrabbed) => {
      if (isGrabbed !== wasGrabbed) scheduleOnRN(setFollowActive, isGrabbed);
    },
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .shouldCancelWhenOutside(false)
        .onBegin((e) => {
          press.value = withSpring(1, PRESS_SPRING);
          hoveredValue.value = "";

          const inside =
            e.x >= pillX.value && e.x <= pillX.value + pillWidth.value;
          grabbed.value = draggable && inside;
          grabOffset.value = pillX.value - e.x;
          if (grabbed.value) {
            dragTarget.value = pillX.value;
            dragVelocity.value = 0;
            return;
          }

          const tapped = boxAtX(boxesValue.value, e.x);
          if (tapped) scheduleOnRN(setValue, tapped.value);
        })
        .onUpdate((e) => {
          if (!grabbed.value) return;

          dragTarget.value = clampValue(
            e.x + grabOffset.value,
            0,
            Math.max(listWidthValue.value - pillWidth.value, 0),
          );
          const over = nearestBox(
            boxesValue.value,
            dragTarget.value + pillWidth.value / 2,
          );
          if (over && over.value !== hoveredValue.value) {
            hoveredValue.value = over.value;
            pillWidth.value = withSpring(over.width, PILL_SPRING);
          }
        })
        .onFinalize(() => {
          press.value = withSpring(0, PRESS_SPRING);
          if (!grabbed.value) return;
          grabbed.value = false;

          const box = nearestBox(
            boxesValue.value,
            pillX.value + pillWidth.value / 2,
          );
          if (!box) return;

          pillX.value = withSpring(box.x, {
            ...PILL_SPRING,
            velocity: dragVelocity.value,
          });
          pillWidth.value = withSpring(box.width, PILL_SPRING);
          dragVelocity.value = 0;
          scheduleOnRN(setValue, box.value);
        }),
    [
      boxesValue,
      listWidthValue,
      grabbed,
      grabOffset,
      dragTarget,
      dragVelocity,
      hoveredValue,
      pillX,
      pillWidth,
      press,
      setValue,
      draggable,
    ],
  );

  const clipStyle = useAnimatedStyle<Pick<ViewStyle, "width" | "transform">>(
    () => {
      const grow = press.value * PRESS_GROW;
      return {
        width: pillWidth.value + grow * 2,
        transform: [{ translateX: pillX.value - grow }],
      };
    },
  );

  const innerStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => {
    const grow = press.value * PRESS_GROW;
    return { transform: [{ translateX: -(pillX.value - grow) }] };
  });

  const rowStyle = useMemo<ViewStyle>(() => ({ gap }), [gap]);

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.list, style]} onLayout={onLayout}>
        <MaskedTabLayerContext.Provider value="base">
          <View style={[styles.row, rowStyle]}>{children}</View>
        </MaskedTabLayerContext.Provider>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.clip,
            {
              borderRadius: Math.max(radius - padding, 0),
              backgroundColor: palette.pill,
            },
            clipStyle,
          ]}
        >
          <Animated.View
            style={[styles.row, rowStyle, { width: listWidth }, innerStyle]}
          >
            <MaskedTabLayerContext.Provider value="active">
              {children}
            </MaskedTabLayerContext.Provider>
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const MaskedTabBarTrigger: React.FC<IMaskedTabBarTrigger> &
  React.FunctionComponent<IMaskedTabBarTrigger> = ({
  children,
  value,
  disabled = false,
  style,
}: IMaskedTabBarTrigger): React.JSX.Element => {
  const { registerTrigger } = useMaskedTabBar("MaskedTabBar.Trigger");
  const layer = useMaskedTabLayer();

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (layer !== "base") return;
      const { x, width } = e.nativeEvent.layout;
      registerTrigger(value, { x, width }, disabled);
    },
    [layer, registerTrigger, value, disabled],
  );

  return (
    <View
      onLayout={onLayout}
      style={[styles.trigger, disabled ? styles.disabled : null, style]}
    >
      {children}
    </View>
  );
};

const MaskedTabBarLabel: React.FC<IMaskedTabBarLabel> &
  React.FunctionComponent<IMaskedTabBarLabel> = ({
  children,
  style,
}: IMaskedTabBarLabel): React.JSX.Element => {
  const { palette, fontSize, fontWeight } =
    useMaskedTabBar("MaskedTabBar.Label");
  const layer = useMaskedTabLayer();

  return (
    <Text
      numberOfLines={1}
      style={[
        {
          fontSize,
          fontWeight,
          color: layer === "active" ? palette.active : palette.inactive,
        } as TextStyle,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const MaskedTabBarIcon: React.FC<IMaskedTabBarIcon> &
  React.FunctionComponent<IMaskedTabBarIcon> = ({
  children,
  size,
  style,
}: IMaskedTabBarIcon): React.JSX.Element => {
  const { palette, iconSize } = useMaskedTabBar("MaskedTabBar.Icon");
  const layer = useMaskedTabLayer();
  const active = layer === "active";
  const resolvedSize = size ?? iconSize;

  const content =
    typeof children === "function"
      ? children({
          color: active ? palette.active : palette.inactive,
          size: resolvedSize,
          active,
        })
      : children;

  return (
    <View
      style={[
        styles.icon,
        { width: resolvedSize, height: resolvedSize },
        style,
      ]}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignSelf: "stretch",
    justifyContent: "center",
    overflow: "hidden",
  },
  list: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  clip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    overflow: "hidden",
  },
  trigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: DEFAULT_TRIGGER_GAP,
    paddingHorizontal: DEFAULT_TRIGGER_PADDING_X,
    height: "100%",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
});

const MaskedTabBar = createCompoundComponent(
  "MaskedTabBar",
  memo(MaskedTabBarRoot),
  {
    List: createCompoundComponent("MaskedTabBar.List", MaskedTabBarList),
    Trigger: createCompoundComponent(
      "MaskedTabBar.Trigger",
      MaskedTabBarTrigger,
    ),
    Label: createCompoundComponent("MaskedTabBar.Label", MaskedTabBarLabel),
    Icon: createCompoundComponent("MaskedTabBar.Icon", MaskedTabBarIcon),
  },
);

export {
  MaskedTabBar,
  MaskedTabBarRoot,
  MaskedTabBarList,
  MaskedTabBarTrigger,
  MaskedTabBarLabel,
  MaskedTabBarIcon,
};
export type {
  IMaskedTabBarRoot,
  IMaskedTabBarList,
  IMaskedTabBarTrigger,
  IMaskedTabBarLabel,
  IMaskedTabBarIcon,
  IMaskedTabBarPalette,
  IMaskedTabIconState,
  TMaskedTabBarTheme,
} from "./types";
export default MaskedTabBar;
