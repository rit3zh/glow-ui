import { Skia } from "@shopify/react-native-skia";

function toRgb<T extends string>(color: T): [number, number, number] {
  const c = Skia.Color(color);
  return [c[0], c[1], c[2]];
}

export { toRgb };
