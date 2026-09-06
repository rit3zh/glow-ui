// @ts-check
import React, { memo, useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  G,
  Path,
  Svg,
  // @ts-check
  type PathProps,
  type GProps,
} from "react-native-svg";
import type { ICheckbox, IStrokePath } from "./types";
import { BOX_PATH, PADDING, TICK_PATH, VIEWPORT_SIZE } from "./conf";

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

const StrokePath: React.FC<IStrokePath> = ({
  animValue,
  ...pathProps
}: IStrokePath): React.ReactNode & React.JSX.Element => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  const animatedStrokeProps = useAnimatedProps<
    Pick<PathProps, "strokeDashoffset" | "opacity">
  >(() => {
    if (pathLength === 0) {
      return {
        strokeDashoffset: 1,
        opacity: 0,
      };
    }

    const easedProgress = Easing.bezierFn(0.37, 0, 0.63, 1)(animValue.value);
    const offset = pathLength - pathLength * easedProgress;

    return {
      strokeDashoffset: Math.max(0, offset),
      opacity: 1,
    };
  });

  const handleLayout = () => {
    if (pathRef.current) {
      // @ts-ignore
      const totalLength = pathRef.current?.getTotalLength();
      setPathLength(totalLength);
    }
  };

  return (
    <AnimatedSvgPath
      ref={pathRef}
      onLayout={handleLayout}
      strokeDasharray={pathLength}
      animatedProps={animatedStrokeProps}
      {...pathProps}
    />
  );
};

export const Checkbox: React.FC<ICheckbox> = memo(
  ({
    checked = false,
    checkmarkColor,
    stroke = 1.5,
    size,
    showBorder = false,
  }: ICheckbox) => {
    const animValue = useSharedValue<number>(checked ? 1 : 0);
    const borderAnimValue = useSharedValue<number>(showBorder ? 1 : 0);
    const scaleValue = useSharedValue<number>(1);
    const isFirstRender = useRef<boolean>(true);

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        animValue.value = checked ? 1 : 0;
        borderAnimValue.value = showBorder ? 1 : 0;
        scaleValue.value = 1;
        return;
      }

      animValue.value = withTiming<number>(checked ? 1 : 0, {
        duration: checked ? 300 : 250,
        easing: checked
          ? Easing.bezier(0.4, 0, 0.2, 1)
          : Easing.bezier(0.4, 0, 0.6, 1),
      });

      if (checked) {
        scaleValue.value = withSpring(1, {
          damping: 10,
          stiffness: 150,
          mass: 0.5,
        });
      } else {
        scaleValue.value = withTiming(1, { duration: 100 });
      }
    }, [checked, animValue, scaleValue]);

    useEffect(() => {
      if (isFirstRender.current) return;

      borderAnimValue.value = withTiming(showBorder ? 1 : 0, {
        duration: 250,
        easing: showBorder
          ? Easing.bezier(0.4, 0, 0.2, 1)
          : Easing.bezier(0.4, 0, 0.6, 1),
      });
    }, [showBorder, borderAnimValue]);

    const animatedCheckmarkProps = useAnimatedProps<Pick<GProps, "transform">>(
      () => {
        const scale = interpolate(scaleValue.value, [0, 1], [0.8, 1]);

        return {
          transform: [
            { translateX: 32 },
            { translateY: 32 },
            { scale },
            { translateX: -32 },
            { translateY: -32 },
          ],
        };
      },
    );

    const viewBox = [
      -PADDING,
      -PADDING,
      VIEWPORT_SIZE + PADDING,
      VIEWPORT_SIZE + PADDING,
    ].join(" ");

    return (
      <Svg width={size} height={size} viewBox={viewBox}>
        <StrokePath
          d={BOX_PATH}
          stroke={checkmarkColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          animValue={borderAnimValue}
        />
        <AnimatedG animatedProps={animatedCheckmarkProps}>
          <StrokePath
            d={TICK_PATH}
            stroke={checkmarkColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            animValue={animValue}
          />
        </AnimatedG>
      </Svg>
    );
  },
);

export default memo<React.FC<ICheckbox>>(Checkbox);
