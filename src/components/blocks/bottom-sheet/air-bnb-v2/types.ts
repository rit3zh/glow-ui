import type { ImageSourcePropType } from "react-native";

export interface ICloseIcon {
  size?: number;
  color?: string;
}

export interface IAirBnbBottomSheetNotice {
  title?: string;

  actionLabel?: string;

  artwork?: ImageSourcePropType;

  hideCloseButton?: boolean;

  openOnFocus?: boolean;

  onActionPress?: () => void;

  onClose?: () => void;
}
