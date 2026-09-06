export interface IEmailIcon {
  size?: number;
  color?: string;
}

export interface IEmailVerificationBottomSheet {
  title?: string;

  description?: string;

  email?: string;

  actionLabel?: string;

  secondaryLabel?: string;

  hideSecondaryAction?: boolean;

  openOnFocus?: boolean;

  onActionPress?: () => void;

  onSecondaryPress?: () => void;

  onClose?: () => void;
}
