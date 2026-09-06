import type { ReactNode } from "react";
import { memo, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { TOAST_ICON_SIZE } from "../toast.constants";
import type { IIcon, TToastType } from "../Toast.types";

const SuccessIcon = memo(({ size = TOAST_ICON_SIZE, color }: IIcon) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
    />
  </Svg>
));

const ErrorIcon = memo(({ size = TOAST_ICON_SIZE, color }: IIcon) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
    />
  </Svg>
));

const InfoIcon = memo(({ size = TOAST_ICON_SIZE, color }: IIcon) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
    />
  </Svg>
));

const WarningIcon = memo(({ size = TOAST_ICON_SIZE, color }: IIcon) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
    />
  </Svg>
));

const CloseIcon = memo(({ size = 14, color }: IIcon) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
));

const CheckIcon = memo(({ size = 22, color }: IIcon) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
));

const TrashIcon = memo(({ size = 20, color }: IIcon) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H7a1 1 0 01-1-1V6" />
    <Line x1={10} y1={11} x2={10} y2={17} />
    <Line x1={14} y1={11} x2={14} y2={17} />
  </Svg>
));

const LoadingIcon = memo(({ size = TOAST_ICON_SIZE, color }: IIcon) => {
  const spin = useSharedValue<number>(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    );
  }, [spin]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle
          cx={12}
          cy={12}
          r={9}
          stroke={color}
          strokeOpacity={0.25}
          strokeWidth={2.5}
          fill="none"
        />
        <Circle
          cx={12}
          cy={12}
          r={9}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="14 43"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
});

function getTypeIcon(type: TToastType, color: string): ReactNode {
  switch (type) {
    case "success":
      return <SuccessIcon color={color} />;
    case "error":
      return <ErrorIcon color={color} />;
    case "info":
      return <InfoIcon color={color} />;
    case "warning":
      return <WarningIcon color={color} />;
    case "loading":
      return <LoadingIcon color={color} />;
    default:
      return null;
  }
}

export {
  CheckIcon,
  CloseIcon,
  ErrorIcon,
  getTypeIcon,
  InfoIcon,
  LoadingIcon,
  SuccessIcon,
  TrashIcon,
  WarningIcon,
};
