import React, { memo, useCallback, useMemo, useState } from "react";
import {
  ScaledSize,
  StyleSheet,
  View,
  ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  isSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import type { ISquircleView } from "./types";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BORDER_COLOR,
  DEFAULT_BORDER_WIDTH,
  DEFAULT_CORNER_RADIUS,
  DEFAULT_CORNER_SMOOTHING,
} from "./const";
import { buildSquirclePath } from "./helper";

export const SquircleView: React.FC<ISquircleView> &
  React.FunctionComponent<ISquircleView> = memo<
  ISquircleView & React.ComponentProps<typeof SquircleView>
>(
  ({
    width: widthProp,
    height: heightProp,
    cornerRadius: cornerRadiusProp = DEFAULT_CORNER_RADIUS,
    cornerSmoothing: cornerSmoothingProp = DEFAULT_CORNER_SMOOTHING,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    borderColor = DEFAULT_BORDER_COLOR,
    borderWidth = DEFAULT_BORDER_WIDTH,
    children,
    style,
  }: Partial<ISquircleView> & React.ComponentProps<typeof SquircleView>):
    | (React.ReactNode & React.JSX.Element & React.ReactNode)
    | null => {
    const [measured, setMeasured] = useState({ w: 0, h: 0 });

    const handleLayout = useCallback(<T extends LayoutChangeEvent>(e: T) => {
      const { width, height } = e.nativeEvent.layout;
      setMeasured((prev: { w: number; h: number }) =>
        prev.w === width && prev.h === height ? prev : { w: width, h: height },
      );
    }, []);

    const isDynamic = widthProp == null || heightProp == null;
    const width = widthProp ?? measured.w;
    const height = heightProp ?? measured.h;
    const hasSize = width > 0 && height > 0;

    const crIsShared = isSharedValue<number>(cornerRadiusProp);
    const csIsShared = isSharedValue<number>(cornerSmoothingProp);

    const animatedPath = useDerivedValue<string>(() => {
      "worklet";
      if (!hasSize) return "";

      const cr = crIsShared
        ? (cornerRadiusProp as SharedValue<number>).value
        : (cornerRadiusProp as number);

      const cs = csIsShared
        ? (cornerSmoothingProp as SharedValue<number>).value
        : (cornerSmoothingProp as number);

      return buildSquirclePath(width, height, cr, cs);
    });

    const clipStyle = useAnimatedStyle<Pick<ViewStyle, "borderRadius">>(() => {
      "worklet";
      return {
        borderRadius: crIsShared
          ? (cornerRadiusProp as SharedValue<number>).value
          : (cornerRadiusProp as number),
      };
    });

    const containerStyle = useMemo(
      () => (isDynamic ? undefined : { width: widthProp, height: heightProp }),
      [isDynamic, widthProp, heightProp],
    );

    return (
      <View
        onLayout={isDynamic ? handleLayout : undefined}
        style={[containerStyle, style]}
      >
        {hasSize ? (
          <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path path={animatedPath} color={backgroundColor} />
          </Canvas>
        ) : null}
        <Animated.View style={[styles.clip, clipStyle]}>
          {children}
        </Animated.View>

        {hasSize && borderWidth > 0 ? (
          <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path
              path={animatedPath}
              color={borderColor}
              style="stroke"
              strokeWidth={borderWidth * 2}
            />
          </Canvas>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
});

export default memo<
  React.FC<ISquircleView> &
    React.FunctionComponent<ISquircleView> &
    Partial<ISquircleView> &
    React.ComponentProps<typeof SquircleView> &
    React.ReactNode
>(SquircleView);
