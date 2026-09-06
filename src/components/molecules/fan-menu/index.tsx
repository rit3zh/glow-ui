import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
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
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { FanContext, useFan } from "./context";
import {
  DEFAULT_BUTTON_SIZE,
  DEFAULT_DIRECTION,
  DEFAULT_ITEM_DIRECTION,
  DEFAULT_OFFSET,
  DEFAULT_POSITION,
  DEFAULT_SPACING,
  DEFAULT_SPREAD,
  DEFAULT_TILT,
  DEFAULT_SPRING,
  DEFAULT_STAGGER,
} from "./const";
import {
  computeItemGeometry,
  directionAngle,
  resolveAnchor,
  resolveSweep,
} from "./utils";
import type {
  IFanItem,
  IFanItemIcon,
  IFanItemLabel,
  IFanMenu,
  IFanTrigger,
  IResolvedConfig,
} from "./types";
import { BlurView, type BlurViewProps } from "expo-blur";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const hasChildType = (children: React.ReactNode, type: unknown): boolean =>
  React.Children.toArray(children).some(
    (c) => React.isValidElement(c) && c.type === type,
  );

const FanRoot: React.FC<IFanMenu> & React.FunctionComponent<IFanMenu> =
  memo<IFanMenu>(
    ({
      children,
      open,
      defaultOpen = false,
      onOpenChange,
      onOpen,
      onClose,
      position = DEFAULT_POSITION,
      offset = DEFAULT_OFFSET,
      direction = DEFAULT_DIRECTION,
      itemDirection = DEFAULT_ITEM_DIRECTION,
      spacing = DEFAULT_SPACING,
      spread = DEFAULT_SPREAD,
      tilt = DEFAULT_TILT,
      stagger = DEFAULT_STAGGER,
      springConfig = DEFAULT_SPRING,
      buttonSize = DEFAULT_BUTTON_SIZE,
      closeOnBackdropPress = true,
      style,
    }: IFanMenu): React.JSX.Element & React.ReactNode & React.ReactElement => {
      const isControlled = open !== undefined;
      const [uncontrolled, setUncontrolled] = useState<boolean>(defaultOpen);
      const isOpen = isControlled ? open : uncontrolled;

      const [order, setOrder] = useState<string[]>([]);
      const progress = useSharedValue<number>(defaultOpen ? 1 : 0);
      const firstRun = useRef<boolean>(true);

      const config = useMemo<IResolvedConfig>(
        () => ({
          baseAngle: directionAngle(direction),
          sweep: resolveSweep(direction, itemDirection),
          spread,
          spacing,
          tilt,
          springConfig,
          stagger,
        }),
        [
          direction,
          itemDirection,
          spread,
          spacing,
          tilt,
          springConfig,
          stagger,
        ],
      );

      const setOpenState = useCallback(
        (next: boolean) => {
          if (!isControlled) setUncontrolled(next);
          onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
      );

      const openMenu = useCallback(() => setOpenState(true), [setOpenState]);
      const closeMenu = useCallback(() => setOpenState(false), [setOpenState]);
      const toggle = useCallback(
        () => setOpenState(!isOpen),
        [isOpen, setOpenState],
      );

      const pressItem = useCallback(
        (value: string | undefined, cb?: (v?: string) => void) => {
          cb?.(value);
          setOpenState(false);
        },
        [setOpenState],
      );

      const registerItem = useCallback((id: string) => {
        setOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }, []);

      const unregisterItem = useCallback((id: string) => {
        setOrder((prev) => prev.filter((x) => x !== id));
      }, []);

      useEffect(() => {
        if (firstRun.current) {
          firstRun.current = false;
          progress.value = isOpen ? 1 : 0;
          return;
        }
        if (isOpen) {
          progress.value = withSpring<number>(1, springConfig);
          onOpen?.();
        } else {
          const total = Math.max(0, order.length - 1) * stagger;
          progress.value = withDelay<number>(
            total,
            withSpring<number>(0, springConfig),
          );
          onClose?.();
        }
      }, [isOpen]);

      const contextValue = useMemo(
        () => ({
          progress,
          isOpen,
          open: openMenu,
          close: closeMenu,
          toggle,
          pressItem,
          registerItem,
          unregisterItem,
          order,
          config,
          buttonSize,
        }),
        [
          progress,
          isOpen,
          openMenu,
          closeMenu,
          toggle,
          pressItem,
          registerItem,
          unregisterItem,
          order,
          config,
          buttonSize,
        ],
      );

      const backdropStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(
        () => ({
          opacity: interpolate(
            progress.value,
            [0, 1],
            [0, 1],
            Extrapolation.CLAMP,
          ),
        }),
      );

      const showDefaultTrigger = !hasChildType(children, FanTrigger);

      const anchor = useMemo(
        () => resolveAnchor(position, offset, buttonSize, SCREEN_W),
        [position, offset, buttonSize],
      );

      return (
        <FanContext.Provider value={contextValue}>
          <View
            style={[
              styles.root,
              { width: buttonSize, height: buttonSize },
              anchor,
              style,
            ]}
            pointerEvents="box-none"
          >
            <Animated.View
              style={[
                styles.backdrop,
                {
                  left: buttonSize / 2 - SCREEN_W,
                  top: buttonSize / 2 - SCREEN_H,
                },
                backdropStyle,
              ]}
              pointerEvents={isOpen ? "auto" : "none"}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={closeOnBackdropPress ? closeMenu : undefined}
              />
            </Animated.View>

            {children}

            {showDefaultTrigger ? <FanTrigger /> : null}
          </View>
        </FanContext.Provider>
      );
    },
  );

const FanTrigger = memo<IFanTrigger>(
  ({ children, style }: IFanTrigger): React.JSX.Element => {
    const { progress, toggle, buttonSize } = useFan();
    const pressed = useSharedValue(0);

    const buttonStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 0.9],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    const iconStyle = useAnimatedStyle(() => ({
      transform: [
        { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` },
      ],
    }));

    return (
      <Animated.View
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          buttonStyle,
          style,
        ]}
      >
        <Pressable
          style={styles.buttonPress}
          onPress={toggle}
          onPressIn={() => {
            pressed.value = withSpring(1, {
              damping: 20,
              stiffness: 250,
              mass: 0.5,
            });
          }}
          onPressOut={() => {
            pressed.value = withSpring(0, {
              damping: 20,
              stiffness: 250,
              mass: 0.5,
            });
          }}
          hitSlop={10}
        >
          <Animated.View style={iconStyle}>
            {children ?? <Feather name="plus" size={26} color="#1d1d1f" />}
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  },
);

const FanItem = memo<IFanItem>(
  ({ children, value, onPress, style }: IFanItem): React.JSX.Element => {
    const id = useId();
    const {
      order,
      registerItem,
      unregisterItem,
      isOpen,
      config,
      buttonSize,
      pressItem,
    } = useFan();

    const [size, setSize] = useState({ w: 0, h: 0 });

    const index = order.indexOf(id);
    const count = order.length;
    const rank = Math.max(count - index, 1);
    const geo = useMemo(
      () => computeItemGeometry(rank, config),
      [rank, config],
    );

    const cx = buttonSize / 2;
    const cy = buttonSize / 2;

    const spring = config.springConfig as WithSpringConfig;
    const t = useSharedValue<number>(isOpen ? 1 : 0);
    const pressed = useSharedValue<number>(0);

    useEffect(() => {
      registerItem(id);
      return () => unregisterItem(id);
    }, [id, registerItem, unregisterItem]);

    useEffect(() => {
      if (index < 0) return;
      const delay = (isOpen ? index : count - 1 - index) * config.stagger;
      t.value = withDelay<number>(delay, withSpring(isOpen ? 1 : 0, spring));
    }, [isOpen, index, count, config.stagger, spring, t]);

    const animatedStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => {
      const p = t.value;
      return {
        opacity: interpolate(p, [0, 0.25, 1], [0, 0.1, 1], Extrapolation.CLAMP),
        transform: [
          { translateX: geo.x * p - size.w / 2 },
          { translateY: geo.y * p - size.h / 2 },
          { rotate: `${geo.rotate * p}deg` },
        ],
      };
    });

    const pressableStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            pressed.value,
            [0, 1],
            [1, 1.1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    const blurProps = useAnimatedProps<Pick<BlurViewProps, "intensity">>(
      () => ({
        intensity: withSpring(
          interpolate(
            t.value,
            [0, 0.25, 0.45, 1],
            [0, 30, 35, 0],
            Extrapolation.CLAMP,
          ),
        ),
      }),
    );

    const handlePressIn = () => {
      pressed.value = withSpring(1);
    };
    const handlePressOut = () => {
      pressed.value = withSpring(0);
    };
    const handlePress = () => pressItem(value, onPress);
    const handleLayout = (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      setSize((prev) =>
        prev.w === width && prev.h === height ? prev : { w: width, h: height },
      );
    };

    return (
      <Animated.View
        style={[styles.itemAnchor, { left: cx, top: cy }, animatedStyle]}
        pointerEvents={isOpen ? "box-none" : "none"}
      >
        <AnimatedPressable
          style={[styles.pill, style, pressableStyle]}
          disabled={!isOpen}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLayout={handleLayout}
        >
          {children}
        </AnimatedPressable>
        <AnimatedBlurView
          animatedProps={blurProps}
          tint="prominent"
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.itemBlur]}
        />
      </Animated.View>
    );
  },
);

const FanItemIcon = memo<IFanItemIcon>(
  ({ children, style }: IFanItemIcon): React.JSX.Element => (
    <View style={[styles.itemIcon, style]}>{children}</View>
  ),
);

FanItemIcon.displayName = "FanMenu.ItemIcon";

const FanItemLabel = memo<IFanItemLabel>(
  ({ children, style }: IFanItemLabel): React.JSX.Element => (
    <Text style={[styles.itemLabel, style]} numberOfLines={1}>
      {children}
    </Text>
  ),
);

const FanMenu = Object.assign(FanRoot, {
  Trigger: FanTrigger,
  Item: FanItem,
  Icon: FanItemIcon,
  Label: FanItemLabel,
});

export { FanMenu };
export default FanMenu;
export type { IFanMenu } from "./types";
export { FanDirection, FanItemDirection, FanPosition } from "./types";

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  backdrop: {
    position: "absolute",
    width: SCREEN_W * 2,
    height: SCREEN_H * 2,
    zIndex: 0,
  },
  itemAnchor: {
    position: "absolute",
    zIndex: 1,

    width: SCREEN_W,
    alignItems: "flex-start",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: "center",
    borderRadius: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
  itemBlur: {
    overflow: "hidden",
    borderRadius: 99,
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
  button: {
    position: "absolute",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  buttonPress: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
