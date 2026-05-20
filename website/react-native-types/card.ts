import type { ReactNode } from "react";
import type {
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";

interface CardTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

interface CardStatusProps {
  children: ReactNode;
  icon?: ReactNode;
  style?: ViewStyle;
}

interface CardImageProps {
  source: ImageSourcePropType;
  children?: ReactNode;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

interface CardUserInfoProps {
  avatar: ImageSourcePropType;
  username: string;
  timestamp: string;
  style?: ViewStyle;
}

interface CardActionProps {
  onPress: () => void;
  children: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface CardFooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export {
  CardProps,
  CardTitleProps,
  CardStatusProps,
  CardImageProps,
  CardUserInfoProps,
  CardActionProps,
  CardFooterProps,
};
