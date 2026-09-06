/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Source of truth: cloudflare/v2-mockups/ + cloudflare/mockups/config.ts
 * Regenerate with: bun run mockups:sync
 */

export const V2_MOCKUPS_ORIGIN = "https://pub-011895838bd549b3b6311d0df5257626.r2.dev" as const;

/** Every key in the bucket lives under this prefix. */
export const V2_MOCKUPS_PREFIX = "blocks" as const;

export type MockupCategoryId =
  | "bottom-sheet"
  | "empty-state"
  | "settings"
  | "welcome-screen";

export type MockupName =
  | "add-address-new"
  | "airbnb-v1"
  | "airbnb-v2"
  | "apple-v1"
  | "billing-v1"
  | "email-verification-v1"
  | "signup-v1"
  | "empty-collection-v1"
  | "empty-gallary-v1"
  | "empty-gift-v1"
  | "empty-inbox-v1"
  | "profile-settings-v1"
  | "profile-settings-v2"
  | "profile-settings-v3"
  | "profile-settings-v4"
  | "welcome-v1"
  | "welcome-v2"
  | "welcome-v3"
  | "welcome-v4";

export interface MockupCategory {
  id: MockupCategoryId;
  /** Human readable label. */
  title: string;
  /** One line, for a category header or a card. */
  description: string;
  /** How many mockups are filed under it. */
  count: number;
}

export interface Mockup {
  /** Slug, derived from the file name. */
  name: MockupName;
  /** Human readable label. */
  title: string;
  /** Which block category this belongs to. */
  category: MockupCategoryId;
  /** Original file name on disk. */
  fileName: string;
  /** MIME type the bucket serves it with. */
  contentType: string;
  /** Object key inside the `reacticx-v2-mockups` bucket. */
  bucketKey: string;
  /** Fully qualified public URL, with a content hash for cache busting. */
  bucketURL: string;
  /** Size in bytes. */
  size: number;
  /** Truncated sha256 of the uploaded file. */
  hash: string;
  /** Pixel size, or null when the header could not be read. */
  width: number | null;
  height: number | null;
  /** width ÷ height. What a gallery weights its row layout by. */
  aspect: number | null;
  /** The block this is a screenshot of, relative to the repo root. */
  block: string | null;
}

export const mockupCategories = [
  {
    id: "bottom-sheet",
    title: "Bottom Sheet",
    description: "Sheets that rise over a dimmed screen — forms, offers, payment and auth.",
    count: 7,
  },
  {
    id: "empty-state",
    title: "Empty State",
    description: "What a list, inbox or gallery shows before it has anything in it.",
    count: 4,
  },
  {
    id: "settings",
    title: "Settings",
    description: "Profile and preference screens built from grouped rows.",
    count: 4,
  },
  {
    id: "welcome-screen",
    title: "Welcome Screen",
    description: "First-run and onboarding screens — the app's opening frame.",
    count: 4,
  },
] as const satisfies readonly MockupCategory[];

export const v2Mockups = [
  {
    name: "add-address-new",
    title: "Add New Address",
    category: "bottom-sheet",
    fileName: "add-address-new.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/add-address-new.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/add-address-new.png?v=40343194",
    size: 144148,
    hash: "403431941a6c30cc",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/add-address-new/index.tsx",
  },
  {
    name: "airbnb-v1",
    title: "Airbnb Promo",
    category: "bottom-sheet",
    fileName: "airbnb-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/airbnb-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/airbnb-v1.png?v=29ae6f87",
    size: 367922,
    hash: "29ae6f87b3f3ad24",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/airbnb-v1/index.tsx",
  },
  {
    name: "airbnb-v2",
    title: "Airbnb Promo · Alt",
    category: "bottom-sheet",
    fileName: "airbnb-v2.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/airbnb-v2.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/airbnb-v2.png?v=5fad97ab",
    size: 187393,
    hash: "5fad97abaacd8cff",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/air-bnb-v2/index.tsx",
  },
  {
    name: "apple-v1",
    title: "Apple Pay",
    category: "bottom-sheet",
    fileName: "apple-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/apple-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/apple-v1.png?v=77cac488",
    size: 159690,
    hash: "77cac488766f88fa",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/apple-v1/index.tsx",
  },
  {
    name: "billing-v1",
    title: "Subscriptions",
    category: "bottom-sheet",
    fileName: "billing-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/billing-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/billing-v1.png?v=d5a7f92d",
    size: 169899,
    hash: "d5a7f92d84471693",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/billing-v1/index.tsx",
  },
  {
    name: "email-verification-v1",
    title: "Email Verification V1",
    category: "bottom-sheet",
    fileName: "email-verification-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/email-verification-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/email-verification-v1.png?v=0d60aeff",
    size: 166844,
    hash: "0d60aeffe840c981",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/email-verification-v1/index.tsx",
  },
  {
    name: "signup-v1",
    title: "Signup V1",
    category: "bottom-sheet",
    fileName: "signup-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/bottom-sheet/signup-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/bottom-sheet/signup-v1.png?v=8844c644",
    size: 142979,
    hash: "8844c644855c4b7c",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/bottom-sheet/signup-v1/index.tsx",
  },
  {
    name: "empty-collection-v1",
    title: "Empty Collection V1",
    category: "empty-state",
    fileName: "empty-collection-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/empty-state/empty-collection-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/empty-state/empty-collection-v1.png?v=cfeb78e3",
    size: 766955,
    hash: "cfeb78e307e1aec7",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/empty-state/empty-collection-v1/index.tsx",
  },
  {
    name: "empty-gallary-v1",
    title: "Empty Gallery",
    category: "empty-state",
    fileName: "empty-gallary-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/empty-state/empty-gallary-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/empty-state/empty-gallary-v1.png?v=6b2e6b9e",
    size: 870487,
    hash: "6b2e6b9e952146ba",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/empty-state/empty-gallary-v1/index.tsx",
  },
  {
    name: "empty-gift-v1",
    title: "Empty Gift V1",
    category: "empty-state",
    fileName: "empty-gift-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/empty-state/empty-gift-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/empty-state/empty-gift-v1.png?v=fedb9cf1",
    size: 214650,
    hash: "fedb9cf18936271f",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/empty-state/empty-gift-v1/index.tsx",
  },
  {
    name: "empty-inbox-v1",
    title: "Empty Inbox V1",
    category: "empty-state",
    fileName: "empty-inbox-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/empty-state/empty-inbox-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/empty-state/empty-inbox-v1.png?v=6c7e9256",
    size: 255007,
    hash: "6c7e9256472266e9",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/empty-state/empty-inbox-v1/index.tsx",
  },
  {
    name: "profile-settings-v1",
    title: "Profile Settings V1",
    category: "settings",
    fileName: "profile-settings-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/settings/profile-settings-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/settings/profile-settings-v1.png?v=0da773d0",
    size: 360825,
    hash: "0da773d02a5baad1",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/settings/profile-settings-v1/index.tsx",
  },
  {
    name: "profile-settings-v2",
    title: "Profile Settings V2",
    category: "settings",
    fileName: "profile-settings-v2.png",
    contentType: "image/png",
    bucketKey: "blocks/settings/profile-settings-v2.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/settings/profile-settings-v2.png?v=ad372a8f",
    size: 300787,
    hash: "ad372a8f37f25206",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/settings/profile-settings-v2/index.tsx",
  },
  {
    name: "profile-settings-v3",
    title: "Profile Settings V3",
    category: "settings",
    fileName: "profile-settings-v3.png",
    contentType: "image/png",
    bucketKey: "blocks/settings/profile-settings-v3.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/settings/profile-settings-v3.png?v=2cbcfa46",
    size: 421317,
    hash: "2cbcfa46c9e3c697",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/settings/profile-settings-v3/index.tsx",
  },
  {
    name: "profile-settings-v4",
    title: "Profile Settings V4",
    category: "settings",
    fileName: "profile-settings-v4.png",
    contentType: "image/png",
    bucketKey: "blocks/settings/profile-settings-v4.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/settings/profile-settings-v4.png?v=42c99b5d",
    size: 306668,
    hash: "42c99b5dcf714170",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/settings/profile-settings-v4/index.tsx",
  },
  {
    name: "welcome-v1",
    title: "Welcome V1",
    category: "welcome-screen",
    fileName: "welcome-v1.png",
    contentType: "image/png",
    bucketKey: "blocks/welcome-screen/welcome-v1.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/welcome-screen/welcome-v1.png?v=52dbd68a",
    size: 3251965,
    hash: "52dbd68aa5be38b1",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/welcome-screen/welcome-v1/index.tsx",
  },
  {
    name: "welcome-v2",
    title: "Welcome V2",
    category: "welcome-screen",
    fileName: "welcome-v2.png",
    contentType: "image/png",
    bucketKey: "blocks/welcome-screen/welcome-v2.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/welcome-screen/welcome-v2.png?v=9f3541f4",
    size: 4183514,
    hash: "9f3541f4cc48370e",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/welcome-screen/welcome-v2/index.tsx",
  },
  {
    name: "welcome-v3",
    title: "Welcome V3",
    category: "welcome-screen",
    fileName: "welcome-v3.png",
    contentType: "image/png",
    bucketKey: "blocks/welcome-screen/welcome-v3.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/welcome-screen/welcome-v3.png?v=41a3aca9",
    size: 170946,
    hash: "41a3aca959e981b4",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/welcome-screen/welcome-v3/index.tsx",
  },
  {
    name: "welcome-v4",
    title: "Welcome V4",
    category: "welcome-screen",
    fileName: "welcome-v4.png",
    contentType: "image/png",
    bucketKey: "blocks/welcome-screen/welcome-v4.png",
    bucketURL: "https://pub-011895838bd549b3b6311d0df5257626.r2.dev/blocks/welcome-screen/welcome-v4.png?v=7335f087",
    size: 213767,
    hash: "7335f087a1965613",
    width: 1320,
    height: 2868,
    aspect: 0.4603,
    block: "src/components/blocks/welcome-screen/welcome-v4/index.tsx",
  },
] as const satisfies readonly Mockup[];

export const v2MockupsByName = Object.fromEntries(
  v2Mockups.map((mockup) => [mockup.name, mockup]),
) as Record<MockupName, Mockup>;

export function getMockup(name: MockupName): Mockup;
export function getMockup(name: string): Mockup | undefined;
export function getMockup(name: string): Mockup | undefined {
  return v2MockupsByName[name as MockupName];
}

export function getMockupURL(name: MockupName): string;
export function getMockupURL(name: string): string | undefined;
export function getMockupURL(name: string): string | undefined {
  return getMockup(name)?.bucketURL;
}

export function getMockupsByCategory(category: MockupCategoryId): Mockup[] {
  return v2Mockups.filter((mockup) => mockup.category === category);
}

export const mockupsByCategory = Object.fromEntries(
  mockupCategories.map((category) => [category.id, getMockupsByCategory(category.id)]),
) as Record<MockupCategoryId, Mockup[]>;
