import { requireNativeViewManager } from "expo-modules-core";
import type { SeekBarViewProps } from "./SeekBar.types";

// import { MeshGradientViewProps } from "./MeshGradient.types";

export default requireNativeViewManager<SeekBarViewProps>(
  "SeekBarIOSReactNative"
);
