import { createContext, useContext } from "react";

import type {
  IPhotoStackContext,
  IPhotoStackItemContext,
  TPhotoStackComponents,
} from "./types";

const PhotoStackContext = createContext<IPhotoStackContext | null>(null);

// Items don't take an `index` prop; the root hands each child its position so
// the tilt/offset tables stay a root-level concern.
const PhotoStackItemContext = createContext<IPhotoStackItemContext | null>(
  null,
);

const usePhotoStack = (
  component: TPhotoStackComponents = "PhotoStack.Item",
): IPhotoStackContext => {
  const ctx = useContext<IPhotoStackContext | null>(PhotoStackContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <PhotoStack>.`);
  }
  return ctx;
};

const usePhotoStackItem = (
  component: TPhotoStackComponents = "PhotoStack.Item",
): IPhotoStackItemContext => {
  const ctx = useContext<IPhotoStackItemContext | null>(PhotoStackItemContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <PhotoStack>.`);
  }
  return ctx;
};

export {
  PhotoStackContext,
  PhotoStackItemContext,
  usePhotoStack,
  usePhotoStackItem,
};
