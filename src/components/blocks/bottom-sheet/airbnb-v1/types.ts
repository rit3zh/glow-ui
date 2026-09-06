import type { ImageSourcePropType } from "react-native";

export interface IAirBnbBottomSheetDiscount {
  title?: string;

  description?: string;

  actionLabel?: string;

  footnote?: string;

  footnoteLinkLabel?: string;

  footnoteLinkUrl?: string;

  artwork?: ImageSourcePropType;

  openOnFocus?: boolean;

  onActionPress?: () => void;

  onClose?: () => void;
}

export interface ICloseIcon {
  size?: number;
  color?: string;
}
