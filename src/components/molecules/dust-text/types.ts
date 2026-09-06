import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type {
  DataSourceParam,
  SkImage,
  SkRect,
} from "@shopify/react-native-skia";

type TDustShape = "circle" | "square";

interface IDustText {
  readonly children: string;
  readonly colors?: string[];
  readonly visible?: boolean;
  readonly duration?: number;
  readonly stagger?: number;
  readonly particleSize?: number;
  readonly density?: number;
  readonly maxParticles?: number;
  readonly shape?: TDustShape;
  readonly drift?: number;
  readonly interactive?: boolean;
  readonly touchRadius?: number;
  readonly touchForce?: number;
  readonly fontSource?: DataSourceParam;
  readonly fontFamily?: string;
  readonly fontSize?: number;
  readonly fontWeight?: TextStyle["fontWeight"];
  readonly autoFit?: boolean;
  readonly paused?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IDustField {
  readonly count: number;
  readonly ox: Float32Array;
  readonly oy: Float32Array;
  readonly sx: Float32Array;
  readonly sy: Float32Array;
  readonly seed: Float32Array;
  readonly phase: Float32Array;
}

interface IDustAtlas {
  readonly image: SkImage;
  readonly cell: number;
  readonly rects: SkRect[];
}

export type { IDustText, IDustField, IDustAtlas, TDustShape };
