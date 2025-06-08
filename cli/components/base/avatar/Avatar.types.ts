interface AvatarItem {
  uri: string;
  name?: string;
}

export interface AvatarGroupProps {
  // Core props
  image: AvatarItem;
  size?: number;
  onPress?(id: string): void;

  // Styling props
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  textColor?: string;

  // State props
  disabled?: boolean;
  loading?: boolean;

  // Display control props
  showAvatar?: boolean;
  showText?: boolean;
  textPosition?: "top" | "bottom" | "right";
  textStyle?: object;

  // Loading & shimmer props
  shimmerSpeed?: number;

  // Interaction props
  pressedScale?: number;
  pressedOpacity?: number;

  // Online indicator props
  showOnlineIndicator?: boolean;
  onlineIndicatorColor?: string;
  onlineIndicatorSize?: number;
}
