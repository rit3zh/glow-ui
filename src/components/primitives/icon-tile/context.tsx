import { createContext, useContext } from "react";

import type { IIconTileContext, TIconTileContext } from "./types";

const IconTileContext = createContext<IIconTileContext | null>(null);

const useIconTile = (component: TIconTileContext): IIconTileContext => {
  const ctx = useContext(IconTileContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <IconTile.Root>.`);
  }
  return ctx;
};

export { IconTileContext, useIconTile };
