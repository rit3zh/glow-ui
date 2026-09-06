export { ReceiptCard } from "./receipt-card";
export type {
  IReceiptCardRoot,
  IReceiptCardSlot,
  IReceiptCardText,
  IReceiptCardSeparator,
  IReceiptCardItem,
  IReceiptCardTotal,
  IReceiptCardBarcode,
  IReceiptCardTornEdge,
  TReceiptPalette,
  TReceiptEdgeSide,
} from "./receipt-card";

export { EventTicketCard } from "./event-ticket-card";
export type {
  IEventTicketCardRoot,
  IEventTicketCardSlot,
  IEventTicketCardText,
  IEventTicketCardDetail,
  IEventTicketCardBarcode,
  IEventTicketCardCode,
  TTicketPalette,
  TTicketPerforation,
  TTicketStubSide,
} from "./event-ticket-card";

export { BarcodeBadge } from "./barcode-badge";
export type {
  IBarcodeBadgeRoot,
  IBarcodeBadgeBars,
  IBarcodeBadgeLabel,
  TBarcodePalette,
} from "./barcode-badge";

export { Polaroid } from "./polaroid";
export type {
  IPolaroidRoot,
  IPolaroidTape,
  IPolaroidPhoto,
  IPolaroidSlot,
  IPolaroidText,
  TPolaroidPalette,
} from "./polaroid";

export {
  ProfileCard,
  // Aliased: several pieces ship a palette named `DEFAULT_PALETTE`, and this
  // barrel is re-exported from the package root.
  DEFAULT_PALETTE as PROFILE_LIGHT_PALETTE,
  DARK_PALETTE as PROFILE_DARK_PALETTE,
} from "./profile-card";
export type {
  IProfileCardRoot,
  IProfileCardCover,
  IProfileCardAvatar,
  IProfileCardSlot,
  IProfileCardText,
  IProfileCardLocation,
  IProfileCardAction,
  TProfilePalette,
} from "./profile-card";

export {
  BookPage,
  DEFAULT_PALETTE as BOOK_INK_PALETTE,
  PAPER_PALETTE as BOOK_PAPER_PALETTE,
} from "./book-page";
export type {
  IBookPageRoot,
  IBookPagePages,
  IBookPageCover,
  IBookPageSlot,
  IBookPageText,
  TBookPalette,
} from "./book-page";

export {
  Coupon,
  DEFAULT_PALETTE as COUPON_ROSE_PALETTE,
  EMERALD_PALETTE as COUPON_EMERALD_PALETTE,
  INK_PALETTE as COUPON_INK_PALETTE,
} from "./coupon";
export type {
  ICouponRoot,
  ICouponSection,
  ICouponCode,
  ICouponDiscount,
  TCouponPalette,
  TCouponOrientation,
  TCouponBorder,
} from "./coupon";

export {
  VerifiedBadge,
  DEFAULT_PALETTE as VERIFIED_SKY_PALETTE,
  EMERALD_PALETTE as VERIFIED_EMERALD_PALETTE,
  INK_PALETTE as VERIFIED_INK_PALETTE,
} from "./verified-badge";
export type {
  IVerifiedBadgeRoot,
  IVerifiedBadgeText,
  IVerifiedBadgeCheck,
  TVerifiedPalette,
} from "./verified-badge";

export {
  SocialButton,
  BRANDS as SOCIAL_BRANDS,
  SOCIAL_ICONS,
} from "./social-button";
export type {
  ISocialButtonRoot,
  ISocialButtonIcon,
  ISocialButtonLabel,
  ISocialIconProps,
  TSocialProvider,
  TSocialVariant,
  TSocialPalette,
} from "./social-button";

export {
  PhotoStack,
  DEFAULT_PALETTE as PHOTO_STACK_PALETTE,
} from "./photo-stack";
export type {
  IPhotoStackRoot,
  IPhotoStackItem,
  IPhotoStackPhoto,
  IPhotoStackCaption,
  TPhotoStackPalette,
} from "./photo-stack";
