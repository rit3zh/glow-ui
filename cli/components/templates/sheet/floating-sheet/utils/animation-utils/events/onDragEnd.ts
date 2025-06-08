import type { DragEndEvent } from "@lodev09/react-native-true-sheet";
import { Animated } from "react-native";

interface DragEndEventProps {
  animation: Animated.Value;
  event: DragEndEvent;
  setIsExpanded: (isExpanded: boolean) => void;
  setSheetPosition: (sheetPosition: number) => void;
  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
  sheetSizes: number[];
}
export const onHandleDragEnd = ({
  event,
  animation,
  setIsExpanded,
  setSheetPosition,
  isMinimized,
  sheetSizes,
  setIsMinimized,
}: DragEndEventProps) => {
  const endValue = event.nativeEvent.value;
  if (isMinimized) {
    let closestValue = sheetSizes[0];
    let minDistance = Math.abs(endValue - sheetSizes[0]);

    for (let i = 1; i < sheetSizes.length; i++) {
      const size = sheetSizes[i];
      const distance = Math.abs(endValue - size);

      if (distance < minDistance) {
        minDistance = distance;
        closestValue = size;
      }
    }

    setIsExpanded(closestValue === sheetSizes[1]);
    setIsMinimized(false);

    setSheetPosition(closestValue);
  } else {
    let closestValue = sheetSizes[0];
    let minDistance = Math.abs(endValue - sheetSizes[0]);

    for (let i = 1; i < sheetSizes.length; i++) {
      const size = sheetSizes[i];
      const distance = Math.abs(endValue - size);

      if (distance < minDistance) {
        minDistance = distance;
        closestValue = size;
      }
    }

    setIsExpanded(closestValue === sheetSizes[1]);

    setSheetPosition(closestValue);

    Animated.spring(animation, {
      toValue: closestValue,
      friction: 12,
      tension: 25,
      useNativeDriver: false,
    }).start();
  }
};
