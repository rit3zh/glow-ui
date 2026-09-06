import React, { memo, useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text as RNText,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useFrameCallback,
  useSharedValue,
  type FrameInfo,
} from "react-native-reanimated";
import SVG, {
  Defs,
  Path,
  Text,
  TextPath,
  type TextPathProps,
} from "react-native-svg";
import { Direction, type ICurvedMarquee } from "./types";
import {
  PATH_CONTROL_X,
  PATH_END_X,
  PATH_START_X,
  PATH_Y,
  VIEW_BOX_HEIGHT,
  VIEW_BOX_WIDTH,
} from "./const";
const AnimatedTextPath = Animated.createAnimatedComponent(TextPath);

const measurePathLength = (curve: number): number => {
  const p1y = PATH_Y + curve;

  const STEPS = 32;
  let length = 0;
  let prevX = PATH_START_X;
  let prevY = PATH_Y;

  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS;
    const mt = 1 - t;
    const x =
      mt * mt * PATH_START_X + 2 * mt * t * PATH_CONTROL_X + t * t * PATH_END_X;
    const y = mt * mt * PATH_Y + 2 * mt * t * p1y + t * t * PATH_Y;
    length += Math.hypot(x - prevX, y - prevY);
    prevX = x;
    prevY = y;
  }

  return length;
};

export const CurvedMarquee: React.FC<Partial<ICurvedMarquee>> =
  memo<ICurvedMarquee>(
    ({
      text: marqueeText = "⟣ REACTICX ⟢ 🤍",
      speed = 500,
      curve = -500,
      direction = Direction.Left,
      textColor = "#ffffff",
      fontSize = 100,
      copies,
      style,
    }: Partial<ICurvedMarquee>): React.ReactNode &
      React.ReactElement &
      React.JSX.Element => {
      const phase = useSharedValue<number>(0);
      const spacing = useSharedValue<number>(0);

      const [measuredSpacing, setMeasuredSpacing] = useState<number>(0);

      const text = useMemo<string>(
        () => marqueeText.replace(/[\s\u00A0]+$/, "") + "\u00A0",
        [marqueeText],
      );

      const pathId = useMemo<string>(
        () => `curved-path-${Math.random().toString(36).slice(2)}`,
        [],
      );

      const pathD = useMemo<string>(
        () =>
          `M${PATH_START_X},${PATH_Y} Q${PATH_CONTROL_X},${PATH_Y + curve} ${PATH_END_X},${PATH_Y}`,
        [curve],
      );

      const pathLength = useMemo<number>(
        () => measurePathLength(curve),
        [curve],
      );

      const totalText = useMemo<string>(() => {
        if (measuredSpacing <= 0) return "";
        const needed =
          Math.ceil((pathLength + measuredSpacing) / measuredSpacing) + 1;
        return text.repeat(copies ?? needed);
      }, [text, measuredSpacing, pathLength, copies]);

      const onMeasure = useCallback(
        (event: LayoutChangeEvent) => {
          const width = event.nativeEvent.layout.width;
          if (width <= 0) return;
          spacing.value = width;
          setMeasuredSpacing((previous) =>
            Math.abs(previous - width) < 0.5 ? previous : width,
          );
        },
        [spacing],
      );

      const isLeft = direction === Direction.Left;
      useFrameCallback((frameInfo: FrameInfo) => {
        "worklet";
        const loop = spacing.value;
        if (loop <= 0) return;

        const deltaTime = frameInfo.timeSincePreviousFrame ?? 16;
        phase.value = (phase.value + (speed * deltaTime) / 1000) % loop;
      }, true);

      const animatedProps = useAnimatedProps(() => {
        "worklet";
        const loop = spacing.value;
        return {
          startOffset:
            loop <= 0 ? 0 : isLeft ? -phase.value : phase.value - loop,
        } as Partial<TextPathProps>;
      }, [isLeft]);

      return (
        <View
          style={[styles.container, style ?? styles.defaultContainer]}
          pointerEvents="none"
        >
          <View style={styles.measureBox} pointerEvents="none">
            <RNText
              style={[styles.measure, { fontSize }]}
              numberOfLines={1}
              onLayout={onMeasure}
              allowFontScaling={false}
            >
              {text}
            </RNText>
          </View>

          {measuredSpacing > 0 ? (
            <SVG
              width="100%"
              height="100%"
              viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
              style={styles.svg}
            >
              <Defs>
                <Path id={pathId} d={pathD} fill="none" stroke="transparent" />
              </Defs>
              <Text fill={textColor} fontSize={fontSize}>
                <AnimatedTextPath
                  href={`#${pathId}`}
                  animatedProps={animatedProps}
                >
                  {totalText}
                </AnimatedTextPath>
              </Text>
            </SVG>
          ) : null}
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  defaultContainer: {
    overflow: "hidden",
  },
  svg: {
    overflow: "visible",
  },
  measureBox: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 100000,
    opacity: 0,
  },
  measure: {
    alignSelf: "flex-start",
    includeFontPadding: false,
  },
});
