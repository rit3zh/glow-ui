import type {
  Animated,
  ImageURISource,
  StyleProp,
  ViewStyle,
} from "react-native";

export interface IFloatingPlayerProps {
  ___experimental?: boolean;
  image?: ImageURISource;
  isPresented?: boolean;
  showImageWhenExpanded?: boolean;

  renderMaximizedContent?: () => React.ReactNode;
  renderMinimizedContent?: () => React.ReactNode;
  customImageAnimation?: (
    animation: Animated.Value,
    defaults: Initials,
  ) => ViewStyle | Animated.WithAnimatedObject<ViewStyle>;
  onSheetDismiss?: () => void;
}

interface Initials {
  width: Animated.AnimatedInterpolation<number>;
  height: Animated.AnimatedInterpolation<number>;
  borderRadius: Animated.AnimatedInterpolation<number>;
  marginTop: Animated.AnimatedInterpolation<number>;
  marginLeft: Animated.AnimatedInterpolation<number>;
  opacity: Animated.AnimatedInterpolation<number>;
  initialMargin: Animated.AnimatedInterpolation<number>;
}
