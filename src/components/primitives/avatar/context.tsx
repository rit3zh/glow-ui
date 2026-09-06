import { createContext, useContext } from "react";

import type { IAvatarContext, TAvatarContext } from "./types";

const AvatarContext = createContext<IAvatarContext | null>(null);

const useAvatar = (component: TAvatarContext): IAvatarContext => {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Avatar.Root>.`);
  }
  return ctx;
};

export { AvatarContext, useAvatar };
