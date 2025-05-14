import { Animated } from "react-native";

interface OnHandleMinimizeProps {
  animation: Animated.Value;
  setIsMinimized: (isMinimized: boolean) => void;
  isMinimized: boolean;
  height: number;
  setSheetPosition: (sheetPosition: number) => void;
}

export const onHandleMinimize = ({
  animation,
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
};
