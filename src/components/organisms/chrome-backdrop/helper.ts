import { Skia } from "@shopify/react-native-skia";
import type { RGB } from "./types";

const colorToRGB = <T extends string>(color: T): RGB => {
  const c = Skia.Color(color);
  return [c[0], c[1], c[2]];
};

export { colorToRGB };
