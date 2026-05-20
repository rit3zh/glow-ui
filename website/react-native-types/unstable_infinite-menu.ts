import type { SkImage } from "@shopify/react-native-skia";

interface IMenuItem {
  image: string;
}

interface IUnstableInfiniteMenu {
  items: IMenuItem[];
  readonly scale?: number;
  readonly stretchIntensity?: number;
  readonly friction?: number;
  readonly snapStrength?: number;
  readonly discSize?: number;
  readonly backgroundColor?: string;
}

interface IDisc {
  screenX: number;
  screenY: number;
  radius: number;
  alpha: number;
  z: number;
  itemIndex: number;
  stretchAmount: number;
  stretchAngle: number;
}

interface IDiscComponent {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  stretchAmount: number;
  stretchAngle: number;
  readonly image?: SkImage | null;
}

export type { IMenuItem, IUnstableInfiniteMenu, IDisc, IDiscComponent };
