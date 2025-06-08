import type { SizeChangeEvent } from "@lodev09/react-native-true-sheet";
import { Animated } from "react-native";

interface SizeChangeEventProps {
  animation?: Animated.Value;
  event?: SizeChangeEvent;
  setIsExpanded?: (isExpanded: boolean) => void;
  setSheetPosition?: (sheetPosition: number) => void;
  isMinimized?: boolean;
  setIsMinimized?: (isMinimized: boolean) => void;
  sheetSizes?: number[];
}

export const onHandleSizeChange = ({
  event,
  animation,
  setIsExpanded,
  setSheetPosition,
  isMinimized,
  sheetSizes,
  setIsMinimized,
}: SizeChangeEventProps) => {
  const newValue = event!.nativeEvent.value;
  if (isMinimized) {
    setIsExpanded!(newValue >= sheetSizes![1] - 10);
    setSheetPosition!(newValue);
    Animated.spring(animation!, {
      toValue: newValue,
      friction: 12,
      tension: 25,
      useNativeDriver: false,
    }).start();
    setIsMinimized!(false);
  } else {
    Animated.spring(animation!, {
      toValue: newValue,
      friction: 12,
      tension: 25,
      useNativeDriver: false,
    }).start();
  }
};
