import React, { memo, useMemo } from "react";
import { View } from "react-native";
import type { ViewStyle } from "react-native";
import type { IGradientAvatar } from "./types";
import { buildMesh } from "./utils";

const GradientAvatar: React.FC<IGradientAvatar> &
  React.FunctionComponent<IGradientAvatar> = memo<IGradientAvatar>(
  ({
    token,
    size = 32,
    rounding,
    palette,
    sheen = true,
    style,
  }: IGradientAvatar): React.ReactNode &
    React.ReactElement &
    React.JSX.Element => {
    const paletteKey = palette?.join(",");

    const { fill, backgroundImage } = useMemo(() => {
      const mesh = buildMesh(token, size, { palette, sheen });
      return { fill: mesh.fill, backgroundImage: mesh.layers.join(", ") };
    }, [token, size, sheen, paletteKey, palette]);

    const meshStyle = {
      width: size,
      height: size,
      borderRadius: rounding ?? size / 2,
      backgroundColor: fill,
      overflow: "hidden",
      experimental_backgroundImage: backgroundImage,
    } as ViewStyle;

    return <View style={[meshStyle, style]} />;
  },
);

export { GradientAvatar };
