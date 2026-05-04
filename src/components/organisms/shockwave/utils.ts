import type { RefObject } from "react";
import type { View } from "react-native";
import {
  makeImageFromView,
  type SkImage,
} from "@shopify/react-native-skia";
import type { ShockwaveValue } from "./types";

async function snapshotPair(
  fromRef: RefObject<View>,
  toRef: RefObject<View>,
  prev: ShockwaveValue,
  next: ShockwaveValue,
): Promise<{ from: SkImage; to: SkImage } | null> {
  const fromImg = await makeImageFromView(fromRef as RefObject<View>);
  const toImg = await makeImageFromView(toRef as RefObject<View>);
  if (!fromImg || !toImg) return null;
  const fromSnapshot = prev === "from" ? fromImg : toImg;
  const toSnapshot = next === "from" ? fromImg : toImg;
  return { from: fromSnapshot, to: toSnapshot };
}

export { snapshotPair };
