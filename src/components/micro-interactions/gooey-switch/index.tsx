// @ts-check
import React, { memo, useEffect, useState } from "react";
import { Platform, StyleSheet, type ViewStyle } from "react-native";
import {
  Canvas,
  Group,
  Blur,
  ColorMatrix,
  Paint,
  Oval,
  Circle,
  RoundedRect,
} from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  useDerivedValue,
  clamp,
  WithSpringConfig,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SymbolView } from "expo-symbols";
import {
  DEFAULT_BLOB_COLOR,
  DEFAULT_ICON_COLOR,
  DEFAULT_OFF_COLOR,
  DEFAULT_ON_COLOR,
  DEFAULT_SIZE,
  DEFAULT_THRESHOLD,
} from "./const";
import type {
  IAnimatedBridge,
  ICoreOval,
  IGooeySwitch,
  IShadowOval,
} from "./types";
import { scheduleOnRN } from "react-native-worklets";
import { Ionicons } from "@expo/vector-icons";

const AnimatedMainOval: React.FC<ICoreOval> &
  React.FunctionComponent<ICoreOval> = ({
  cx,
  cy,
  rx,
  ry,
  progress,
  onColor,
  offColor,
}: ICoreOval):
  | (React.ReactNode & React.JSX.Element & React.ReactElement)
  | null => {
  const color = useDerivedValue<string>(() => {
    return interpolateColor(progress.value, [0, 1], [offColor, onColor]);
  });

  const x = useDerivedValue(() => cx.value - rx.value);
  const y = useDerivedValue(() => cy - ry.value);
  const width = useDerivedValue(() => rx.value * 2);
  const height = useDerivedValue<number>(() => ry.value * 2);

  return <Oval x={x} y={y} width={width} height={height} color={color} />;
};

const AnimatedShadowOval: React.FC<IShadowOval> &
  React.FunctionComponent<IShadowOval> = ({
  cx,
  cy,
  rx,
  ry,
  color,
}: IShadowOval): React.ReactNode & React.JSX.Element & React.ReactElement => {
  const x = useDerivedValue<number>(() => cx.value - rx.value);
  const y = useDerivedValue<number>(() => cy - ry.value);
  const width = useDerivedValue<number>(() => rx.value * 2);
  const height = useDerivedValue<number>(() => ry.value * 2);

  return <Oval x={x} y={y} width={width} height={height} color={color} />;
};

const AnimatedBridge: React.FC<IAnimatedBridge> &
  React.FunctionComponent<IAnimatedBridge> = ({
  leftX,
  rightX,
  cy,
  mainX,
  height,
  color,
  progress,
}: IAnimatedBridge):
  | (React.ReactNode & React.JSX.Element & React.ReactElement)
  | null => {
  const bridgeX = useDerivedValue<number>(() => {
    const p = progress.value;
    if (p <= 0.5) {
      return leftX;
    }
    return mainX.value;
  });

  const bridgeWidth = useDerivedValue<Required<number>>(() => {
    const p = progress.value;
    if (p <= 0.5) {
      return mainX.value - leftX;
    }
    return rightX - mainX.value;
  });

  const bridgeHeight = useDerivedValue<number>(() => {
    const p = progress.value;
    const stretchFactor = interpolate(
      p,
      [0, 0.25, 0.5, 0.75, 1],
      [0.6, 1, 0.8, 1, 0.6],
    );
    return height * stretchFactor;
  });

  const bridgeY = useDerivedValue<number>(() => {
    return cy - bridgeHeight.value / 2;
  });

  const bridgeRadius = useDerivedValue<number>(() => {
    return bridgeHeight.value / 2;
  });

  return (
    <RoundedRect
      x={bridgeX}
      y={bridgeY}
      width={bridgeWidth}
      height={bridgeHeight}
      r={bridgeRadius}
      color={color}
    />
  );
};

export const GooeySwitch: React.FC<IGooeySwitch> &
  React.FunctionComponent<IGooeySwitch> = memo<IGooeySwitch>(
  ({
    active,
    onToggle,
    size = DEFAULT_SIZE,
    inactiveColor = DEFAULT_OFF_COLOR,
    activeColor = DEFAULT_ON_COLOR,
    trackColor = DEFAULT_BLOB_COLOR,
    iconTint = DEFAULT_ICON_COLOR,
    toggleThreshold = DEFAULT_THRESHOLD,
    isDisabled = false,
    showIcons = true,
    animation = {},
    deformation = {},
    connector = {},
    blur,
    gooey = 35,
    renderActiveIcon,
    renderInactiveIcon,
    onDragBegin,
    onDragFinish,
  }: IGooeySwitch):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const [internalActive, setInternalActive] = useState<boolean>(
      active ?? false,
    );
    const isControlled = active !== undefined;
    const currentActive = isControlled ? active : internalActive;

    const {
      stretchX = 1.18,
      squishY = 0.88,
      sideBlobScale = 0.82,
    } = deformation;
    const {
      show: connectorShow = true,
      height: connectorHeight = 0.35,
      offset: connectorOffset = 0,
    } = connector;

    const SWITCH_WIDTH = size;
    const SWITCH_HEIGHT = size * 0.6;
    const BLOB_RADIUS = size * 0.22;
    const SIDE_BLOB_RADIUS = BLOB_RADIUS * sideBlobScale;
    const ICON_SIZE = size * 0.12;
    const X_ICON_SIZE = size * 0.1;
    const BLUR_AMOUNT = blur ?? size * 0.1;
    const BRIDGE_HEIGHT = SWITCH_HEIGHT * connectorHeight;

    const LEFT_X = SWITCH_WIDTH * 0.28;
    const RIGHT_X = SWITCH_WIDTH * 0.72;

    const spring: WithSpringConfig = {
      damping: animation.damping ?? 15,
      stiffness: animation.stiffness ?? 120,
      mass: animation.mass ?? 0.8,
    };

    const progress = useSharedValue<number>(currentActive ? 1 : 0);
    const isDragging = useSharedValue<boolean>(false);

    useEffect(() => {
      if (!isDragging.value) {
        progress.value = withSpring<number>(currentActive ? 1 : 0, spring);
      }
    }, [currentActive]);

    const mainCircleX = useDerivedValue<number>(() =>
      interpolate(progress.value, [0, 1], [LEFT_X, RIGHT_X]),
    );

    const mainBlobRx = useDerivedValue<number>(() => {
      return (
        BLOB_RADIUS *
        interpolate(
          progress.value,
          [0, 0.2, 0.5, 0.8, 1],
          [1, 1 + (stretchX - 1) * 0.6, stretchX, 1 + (stretchX - 1) * 0.6, 1],
        )
      );
    });

    const mainBlobRy = useDerivedValue<number>(() => {
      return (
        BLOB_RADIUS *
        interpolate(
          progress.value,
          [0, 0.2, 0.5, 0.8, 1],
          [1, 1 - (1 - squishY) * 0.6, squishY, 1 - (1 - squishY) * 0.6, 1],
        )
      );
    });

    const innerBlobRx = useDerivedValue<number>(() => {
      return mainBlobRx.value - 1;
    });

    const innerBlobRy = useDerivedValue<number>(() => {
      return mainBlobRy.value - 1;
    });

    const updateValue = <T extends boolean>(newValue: T) => {
      if (!isControlled) {
        setInternalActive(newValue);
      }
      onToggle?.(newValue);
    };

    const triggerDragStart = () => {
      onDragBegin?.();
    };

    const triggerDragEnd = <T extends boolean>(newValue: T) => {
      onDragFinish?.(newValue);
    };

    const panGesture = Gesture.Pan()
      .enabled(!isDisabled)
      .onStart(() => {
        "worklet";
        isDragging.value = true;
        if (onDragBegin) {
          scheduleOnRN<[], void>(triggerDragStart);
        }
      })
      .onUpdate((event) => {
        "worklet";
        const startX = currentActive ? RIGHT_X : LEFT_X;
        const newX = startX + event.translationX;
        const clampedX = clamp(newX, LEFT_X, RIGHT_X);
        const newProgress = interpolate(clampedX, [LEFT_X, RIGHT_X], [0, 1]);
        progress.value = newProgress;
      })
      .onEnd((event) => {
        "worklet";
        isDragging.value = false;

        const velocity = event.velocityX;
        const currentProgress = progress.value;

        let shouldBeOn: boolean;

        if (Math.abs(velocity) > 500) {
          shouldBeOn = velocity > 0;
        } else {
          shouldBeOn = currentProgress > toggleThreshold;
        }

        progress.value = withSpring(shouldBeOn ? 1 : 0, {
          ...spring,
          velocity: velocity / (RIGHT_X - LEFT_X),
        });

        if (shouldBeOn !== currentActive) {
          scheduleOnRN(updateValue, shouldBeOn);
        }

        if (onDragFinish) {
          scheduleOnRN(triggerDragEnd, shouldBeOn);
        }
      });

    const tapGesture = Gesture.Tap()
      .enabled(!isDisabled)
      .onEnd(() => {
        "worklet";
        const newValue = !currentActive;
        progress.value = withSpring(newValue ? 1 : 0, spring);
        scheduleOnRN(updateValue, newValue);
      });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const iconContainerStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(
      () => ({
        transform: [
          {
            translateX: interpolate(
              progress.value,
              [0, 1],
              [-SWITCH_WIDTH * 0.22, SWITCH_WIDTH * 0.22],
            ),
          },
          {
            scaleX: interpolate(
              progress.value,
              [0, 0.2, 0.5, 0.8, 1],
              [1, 1.08, 1.12, 1.08, 1],
            ),
          },
          {
            scaleY: interpolate(
              progress.value,
              [0, 0.2, 0.5, 0.8, 1],
              [1, 0.94, 0.9, 0.94, 1],
            ),
          },
        ],
      }),
    );

    const activeIconStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => ({
      opacity: interpolate(progress.value, [0.6, 1], [0, 1]),
      transform: [{ scale: interpolate(progress.value, [0.6, 1], [0.5, 1]) }],
    }));

    const inactiveIconStyle = useAnimatedStyle<
      Pick<ViewStyle, "opacity" | "transform">
    >(() => ({
      opacity: interpolate(progress.value, [0, 0.4], [1, 0]),
      transform: [{ scale: interpolate(progress.value, [0, 0.4], [1, 0.5]) }],
    }));

    const containerStyle = [
      styles.container,
      {
        width: SWITCH_WIDTH,
        height: SWITCH_HEIGHT,
        opacity: isDisabled ? 0.5 : 1,
      },
    ];

    const colorMatrix = [
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      gooey,
      -14,
    ];

    const defaultActiveIcon = () =>
      Platform.OS === "ios" ? (
        <SymbolView
          name="checkmark"
          size={ICON_SIZE}
          tintColor={iconTint}
          weight="bold"
        />
      ) : (
        <>
          <Ionicons name="checkmark" size={ICON_SIZE} color={iconTint} />
        </>
      );

    const defaultInactiveIcon = () =>
      Platform.OS === "ios" ? (
        <SymbolView
          name="xmark"
          size={X_ICON_SIZE}
          tintColor={iconTint}
          weight="semibold"
        />
      ) : (
        <>
          <Ionicons name="close-outline" size={X_ICON_SIZE} color={iconTint} />
        </>
      );

    return (
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={containerStyle}>
          <Canvas
            style={[
              styles.canvas,
              { width: SWITCH_WIDTH, height: SWITCH_HEIGHT },
            ]}
          >
            <Group
              layer={
                <Paint>
                  <Blur blur={BLUR_AMOUNT} />
                  <ColorMatrix matrix={colorMatrix} />
                </Paint>
              }
            >
              <Circle
                cx={LEFT_X}
                cy={SWITCH_HEIGHT / 2}
                r={SIDE_BLOB_RADIUS}
                color={trackColor}
              />

              <Circle
                cx={RIGHT_X}
                cy={SWITCH_HEIGHT / 2}
                r={SIDE_BLOB_RADIUS}
                color={trackColor}
              />

              {connectorShow && (
                <AnimatedBridge
                  leftX={LEFT_X}
                  rightX={RIGHT_X}
                  cy={SWITCH_HEIGHT / 2 + connectorOffset}
                  mainX={mainCircleX}
                  height={BRIDGE_HEIGHT}
                  color={trackColor}
                  progress={progress}
                />
              )}

              <AnimatedShadowOval
                cx={mainCircleX}
                cy={SWITCH_HEIGHT / 2}
                rx={mainBlobRx}
                ry={mainBlobRy}
                color={trackColor}
              />
            </Group>

            <AnimatedMainOval
              cx={mainCircleX}
              cy={SWITCH_HEIGHT / 2}
              rx={innerBlobRx}
              ry={innerBlobRy}
              progress={progress}
              onColor={activeColor}
              offColor={inactiveColor}
            />
          </Canvas>

          {showIcons && (
            <Animated.View
              style={[
                styles.iconContainer,
                iconContainerStyle,
                { width: BLOB_RADIUS * 2, height: BLOB_RADIUS * 2 },
              ]}
            >
              <Animated.View style={[styles.iconWrapper, activeIconStyle]}>
                {renderActiveIcon
                  ? renderActiveIcon({ size: ICON_SIZE, color: iconTint })
                  : defaultActiveIcon()}
              </Animated.View>

              <Animated.View style={[styles.iconWrapper, inactiveIconStyle]}>
                {renderInactiveIcon
                  ? renderInactiveIcon({ size: X_ICON_SIZE, color: iconTint })
                  : defaultInactiveIcon()}
              </Animated.View>
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    );
  },
);

export default memo<
  React.FC<IGooeySwitch> & React.FunctionComponent<IGooeySwitch>
>(GooeySwitch);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    position: "absolute",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    position: "absolute",
  },
});
