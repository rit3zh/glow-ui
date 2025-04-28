import type { SFSymbol } from "expo-symbols";

type WalletAction = {
  title: string;
  sfSymbol: SFSymbol;
  overlayIcon?: SFSymbol;
  description: string;
  tint: string;
  descrutive?: boolean;
};

export const walletActions: WalletAction[] = [
  {
    title: "Block the card",
    sfSymbol: "wallet.pass",
    overlayIcon: "lock.circle",
    description: "Block the card to prevent unauthorized use.",
    tint: "gray",
  },
  {
    title: "Change PIN",
    sfSymbol: "wallet.pass",
    overlayIcon: "magnifyingglass.circle",
    description: "Change the PIN code of your card.",
    tint: "gray",
  },
  {
    title: "Card settings",
    sfSymbol: "wallet.pass",
    overlayIcon: "pencil.circle",
    description: "Manage your card settings.",
    tint: "gray",
  },
  {
    title: "Deactivate card",
    sfSymbol: "wallet.pass",
    overlayIcon: "creditcard.circle",
    description: "Deactivate the card completely.",
    tint: "red",
    descrutive: true,
  },
];
