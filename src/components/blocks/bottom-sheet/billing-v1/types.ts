export type BillingBrand = "spotify" | "chatgpt" | "cursor";

export interface IBillingSubscription {
  id: string;

  name: string;

  caption?: string;

  amount: number;

  brand?: BillingBrand;
}

export interface IBillingBottomSheet {
  total?: number;

  subtitle?: string;

  currencySymbol?: string;

  searchPlaceholder?: string;

  periodLabel?: string;

  viewAllLabel?: string;

  subscriptions?: IBillingSubscription[];

  openOnFocus?: boolean;

  onPeriodPress?: () => void;

  onViewAllPress?: () => void;

  onSubscriptionPress?: (subscription: IBillingSubscription) => void;

  onClose?: () => void;
}

export interface IBrandIcon {
  size?: number;
}

export interface IChevronIcon extends IBrandIcon {
  direction?: "down" | "right";
}
