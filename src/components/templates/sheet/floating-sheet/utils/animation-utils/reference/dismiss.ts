import { Animated } from "react-native";

interface DismissProps {
  animation: Animated.Value;
  minimizeAnimation: Animated.Value;
  setIsPresented: (isPresented: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setSheetPosition: (sheetPosition: number) => void;
}

export const dismiss = ({
  animation,
  minimizeAnimation,
  setIsPresented,
  setIsMinimized,
  setSheetPosition,
}: DismissProps) => {
  setIsPresented(false);
  setIsMinimized(false);
  setSheetPosition(0);

  Animated.timing(animation, {
    toValue: 0,
    duration: 450,
    useNativeDriver: false,
  }).start();

  Animated.timing(minimizeAnimation, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  }).start();
};
