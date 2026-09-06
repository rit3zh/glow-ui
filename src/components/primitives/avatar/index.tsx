import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image as RNImage, StyleSheet, View, type ViewStyle } from "react-native";

import { buildMesh } from "@/components/base/gradient-avatar/utils";
import { createCompoundComponent } from "@/utils/create-compound-component";
import { AvatarContext, useAvatar } from "./context";
import {
  DEFAULT_AVATAR_SIZE,
  DEFAULT_FALLBACK_DELAY,
  SQUARE_RADIUS_RATIO,
} from "./const";
import type {
  IAvatarFallback,
  IAvatarImage,
  IAvatarRoot,
  TAvatarLoadingStatus,
} from "./types";

const radiusFor = (size: number, shape: "circle" | "square"): number =>
  shape === "circle" ? size / 2 : size * SQUARE_RADIUS_RATIO;

const AvatarRoot: React.FC<IAvatarRoot> = ({
  children,
  size = DEFAULT_AVATAR_SIZE,
  shape = "circle",
  style,
}): React.JSX.Element => {
  const [status, setStatus] = useState<TAvatarLoadingStatus>("idle");

  const ctx = useMemo(
    () => ({ size, shape, status, setStatus }),
    [size, shape, status],
  );

  return (
    <AvatarContext.Provider value={ctx}>
      <View
        style={[
          styles.root,
          {
            width: size,
            height: size,
            borderRadius: radiusFor(size, shape),
          },
          style,
        ]}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
};

const AvatarImage: React.FC<IAvatarImage> = ({
  source,
  style,
  onLoadingStatusChange,
}): React.JSX.Element | null => {
  const { size, shape, status, setStatus } = useAvatar("Avatar.Image");

  useEffect(() => {
    setStatus("loading");
    onLoadingStatusChange?.("loading");
  }, [source]);

  const handleLoad = useCallback(() => {
    setStatus("loaded");
    onLoadingStatusChange?.("loaded");
  }, [onLoadingStatusChange, setStatus]);

  const handleError = useCallback(() => {
    setStatus("error");
    onLoadingStatusChange?.("error");
  }, [onLoadingStatusChange, setStatus]);

  if (status === "error") return null;

  return (
    <RNImage
      source={source}
      onLoad={handleLoad}
      onError={handleError}
      style={[
        StyleSheet.absoluteFillObject as object,
        { borderRadius: radiusFor(size, shape) },
        style,
      ]}
    />
  );
};

let fallbackSeedCounter = 0;

const AvatarFallback: React.FC<IAvatarFallback> = ({
  children,
  seed,
  delayMs = DEFAULT_FALLBACK_DELAY,
  style,
}): React.JSX.Element | null => {
  const { size, shape, status } = useAvatar("Avatar.Fallback");
  const [canRender, setCanRender] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs === 0) return;
    setCanRender(false);
    const timer = setTimeout(() => setCanRender(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const autoSeed = useMemo(() => fallbackSeedCounter++, []);
  const meshSeed =
    seed ?? (typeof children === "string" ? children : autoSeed);

  const meshStyle = useMemo<ViewStyle>(() => {
    const mesh = buildMesh(meshSeed, size);
    return {
      backgroundColor: mesh.fill,
      experimental_backgroundImage: mesh.layers.join(", "),
    } as ViewStyle;
  }, [meshSeed, size]);

  if (status === "loaded" || !canRender) return null;

  return (
    <View
      style={[
        styles.fallback,
        { borderRadius: radiusFor(size, shape) },
        meshStyle,
        style,
      ]}
    >
      {typeof children !== "string" ? children : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27272A",
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

const Avatar = createCompoundComponent("Avatar", AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback };
export default Avatar;
export type {
  IAvatarRoot,
  IAvatarImage,
  IAvatarFallback,
  TAvatarShape,
  TAvatarLoadingStatus,
} from "./types";
