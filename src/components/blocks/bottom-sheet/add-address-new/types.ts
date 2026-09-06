export interface IGlyph {
  size?: number;
  color?: string;
}

export interface IAddAddressBottomSheet {
  title?: string;
  countryLabel?: string;
  country?: string;
  streetPlaceholder?: string;
  streetValue?: string;
  locationTitle?: string;
  locationCaption?: string;
  addAddressTitle?: string;
  hideCloseButton?: boolean;
  openOnFocus?: boolean;
  onCountryPress?: () => void;
  onStreetChange?: (value: string) => void;
  onLocationPress?: () => void;
  onAddAddressPress?: () => void;
  onClose?: () => void;
}
