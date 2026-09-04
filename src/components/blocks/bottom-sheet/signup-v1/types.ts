export interface IGlyph {
  size?: number;
  color?: string;
}

export interface ISignUpBottomSheet {
  title?: string;

  description?: string;

  primaryLabel?: string;

  secondaryLabel?: string;

  hideProviders?: boolean;

  hideCloseButton?: boolean;

  openOnFocus?: boolean;

  onPrimaryPress?: () => void;

  onSecondaryPress?: () => void;

  onApplePress?: () => void;

  onGooglePress?: () => void;

  onClose?: () => void;
}
