import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type {
  DataSourceParam,
  SkImage,
  SkRect,
} from "@shopify/react-native-skia";

import type { TSwarmPreset } from "./forms";

type TSwarmFillRule = "evenodd" | "nonzero";

type TSwarmBox = readonly [number, number, number, number];

interface ISwarmForm {
  readonly outline: string | readonly string[];
  readonly box?: number | readonly [number, number] | TSwarmBox | string;
  readonly fillRule?: TSwarmFillRule;
}

type TSwarmForm = TSwarmPreset | (string & {}) | ISwarmForm;

interface ILetterSwarm {
  readonly forms: readonly TSwarmForm[];
  readonly active?: number;
  readonly cycle?: boolean;
  readonly hold?: number;
  readonly travel?: number;
  readonly tapToMorph?: boolean;
  readonly charset?: string;
  readonly palette?: string[];
  readonly typeface?: DataSourceParam;
  readonly family?: string;
  readonly letterSize?: number;
  readonly weight?: TextStyle["fontWeight"];
  readonly coverage?: number;
  readonly tracking?: number;
  readonly maxLetters?: number;
  readonly sway?: number;
  readonly lift?: number;
  readonly interactive?: boolean;
  readonly reach?: number;
  readonly repel?: number;
  readonly paused?: boolean;
  readonly seed?: number;
  readonly onActiveChange?: (active: number) => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISwarmCloud {
  readonly letters: number;
  readonly forms: number;
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly drift: Float32Array;
  readonly phase: Float32Array;
  readonly tile: Uint16Array;
  readonly nowX: Float32Array;
  readonly nowY: Float32Array;
  readonly startX: Float32Array;
  readonly startY: Float32Array;
}

interface ISwarmAtlas {
  readonly image: SkImage;
  readonly tile: number;
  readonly rects: SkRect[];
}

interface ISwarmScatter {
  readonly total: number;
  readonly x: Float32Array;
  readonly y: Float32Array;
}

interface ISwarmOutline {
  readonly commands: string[];
  readonly box: TSwarmBox | null;
  readonly fillRule: TSwarmFillRule;
}

export type {
  ILetterSwarm,
  ISwarmForm,
  ISwarmCloud,
  ISwarmAtlas,
  ISwarmScatter,
  ISwarmOutline,
  TSwarmForm,
  TSwarmBox,
  TSwarmFillRule,
  TSwarmPreset,
};
