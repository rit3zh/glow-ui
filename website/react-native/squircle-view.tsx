import React, { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import MaskedView from "@react-native-masked-view/masked-view";
import {
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

    const crIsShared = isSharedValue(cornerRadiusProp);
    const csIsShared = isSharedValue(cornerSmoothingProp);

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

    const maskSize = useMemo(() => ({ width, height }), [width, height]);

    const containerStyle = useMemo(() => {
      if (!isDynamic) return { width: widthProp, height: heightProp };
      if (hasSize) return { width, height };
      return undefined;
    }, [isDynamic, widthProp, heightProp, hasSize, width, height]);

    return (
      <View
        onLayout={isDynamic ? handleLayout : undefined}
        style={[containerStyle, style]}
      >
        {!hasSize && children}

        {hasSize ? (
          <>
            <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
              <Path path={animatedPath} color={backgroundColor} />
            </Canvas>

            {children != null ? (
              <MaskedView
                style={StyleSheet.absoluteFill}
                maskElement={
                  <Canvas style={maskSize}>
                    <Path path={animatedPath} color="white" />
                  </Canvas>
                }
              >
                <View style={StyleSheet.absoluteFill}>{children}</View>
              </MaskedView>
            ) : null}

            {borderWidth > 0 ? (
              <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                <Path
                  path={animatedPath}
                  color={borderColor}
                  style="stroke"
                  strokeWidth={borderWidth * 2}
                />
              </Canvas>
            ) : null}
          </>
        ) : null}
      </View>
    );
  },
);

export default memo<
  React.FC<ISquircleView> &
    React.FunctionComponent<ISquircleView> &
    Partial<ISquircleView> &
    React.ComponentProps<typeof SquircleView> &
    React.ReactNode
>(SquircleView);
