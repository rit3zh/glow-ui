import { Animated } from "react-native";

interface DismissParams {
  animation: Animated.Value;
  minimizeAnimation: Animated.Value;
  setIsPresented: (isPresented: boolean) => void;
  setIsMinimized?: (isMinimized: boolean) => void;
  setSheetPosition?: (sheetPosition: number) => void;
}

export const dismiss = ({
  animation,
  minimizeAnimation,
  setIsPresented,
  setIsMinimized,
  setSheetPosition,
}: DismissParams) => {
  // When dismissing, reset all animations and states
  animation.setValue(0);
  minimizeAnimation.setValue(0);

  if (setIsPresented) {
    setIsPresented(false);
  }

  if (setIsMinimized) {
    setIsMinimized(false);
  }

  if (setSheetPosition) {
    setSheetPosition(0);
  }
};
