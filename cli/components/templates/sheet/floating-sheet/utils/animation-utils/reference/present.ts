import type { PresentEvent } from "@lodev09/react-native-true-sheet";
import { Animated } from "react-native";

interface PresentEventProps {
  animation: Animated.Value;
  setIsPresented: (isPresented: boolean) => void;
  isMinimized: boolean;
  getValueFromIndex: (index: number) => number;
  event: PresentEvent;
}

export const present = ({
  animation,
  getValueFromIndex,
  isMinimized,
  setIsPresented,
  event,
}: PresentEventProps) => {
  if (isMinimized) {
    const initialValue = getValueFromIndex(event.nativeEvent.index);
    setIsPresented(true);
  } else {
    const initialValue = getValueFromIndex(event.nativeEvent.index);
    setIsPresented(true);

    Animated.spring(animation, {
      toValue: initialValue,
      friction: 12,
      tension: 25,
      useNativeDriver: false,
    }).start();
  }
};
