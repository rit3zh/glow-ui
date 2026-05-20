import type { SkImage } from "@shopify/react-native-skia";
import type { StyleProp, ViewStyle } from "react-native";

interface IMenuItem {
  image: string;
}

interface IInfiniteMenu {
  items: IMenuItem[];
  readonly scale?: number;
  readonly backgroundColor?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IDisc {
  screenX: number;
  screenY: number;
  radius: number;
  alpha: number;
  z: number;
  itemIndex: number;
}

interface IDiscComponent {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  image: SkImage | null;
}

export type { IMenuItem, IInfiniteMenu, IDisc, IDiscComponent };
