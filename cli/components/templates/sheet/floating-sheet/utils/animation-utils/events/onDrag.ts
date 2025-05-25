import type { DragChangeEvent } from "@lodev09/react-native-true-sheet";
import { Animated } from "react-native";
import { sheetSizes } from "../../../constants/sizes/sheetSizes";

interface DragChangeEventProps {
  animation: Animated.Value;
  event: DragChangeEvent;
  setIsExpanded: (isExpanded: boolean) => void;
  isMinimized: boolean;
}

const THRESHOLD = sheetSizes[1] - 10;

export const onHandleDragChange = ({
  animation,
  event,
  isMinimized,
  setIsExpanded,
}: DragChangeEventProps) => {
  if (isMinimized) {
    const newValue = event.nativeEvent.value;
    // setIsExpanded(newValue >= THRESHOLD);
  } else {
    const newValue = event.nativeEvent.value;
    setIsExpanded(newValue >= THRESHOLD);

    animation.setValue(newValue);
  }
};
