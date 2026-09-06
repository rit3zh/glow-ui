export interface IGlyph {
  size?: number;
  color?: string;
}

export interface IApplePayBottomSheet {
  brandLabel?: string;

  description?: string;

  cardName?: string;

  cardCaption?: string;

  amount?: string;

  footnote?: string;

  actionLabel?: string;

  openOnFocus?: boolean;

  onCardPress?: () => void;

  onActionPress?: () => void;

  onClose?: () => void;
}
