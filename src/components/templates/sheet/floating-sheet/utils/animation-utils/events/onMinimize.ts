import { Animated } from "react-native";

interface OnHandleMinimizeProps {
  animation: Animated.Value;
  minimizeAnimation: Animated.Value;
  setIsMinimized: (isMinimized: boolean) => void;
  isMinimized: boolean;
  height: number;
  setSheetPosition: (sheetPosition: number) => void;
}

export const onHandleMinimize = ({
  animation,
  minimizeAnimation,
  setIsMinimized,
  isMinimized,
  height,
  setSheetPosition,
}: OnHandleMinimizeProps) => {
  const newMinimizedState = !isMinimized;
  setIsMinimized(newMinimizedState);

  const targetValue = newMinimizedState ? 85 : height * 0.9;
  setSheetPosition(targetValue);

  Animated.spring(animation, {
    toValue: targetValue,
    friction: 8,
    tension: 40,

    useNativeDriver: false,
  }).start();

  Animated.timing(minimizeAnimation, {
    toValue: newMinimizedState ? 1 : 0,
    duration: 500,
    useNativeDriver: false,
  }).start();
};
