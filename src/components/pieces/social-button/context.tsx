import { createContext, useContext } from "react";

import type { ISocialButtonContext, TSocialComponents } from "./types";

const SocialButtonContext = createContext<ISocialButtonContext | null>(null);

const useSocialButton = (
  component: TSocialComponents = "SocialButton.Icon",
): ISocialButtonContext => {
  const ctx = useContext<ISocialButtonContext | null>(SocialButtonContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <SocialButton>.`);
  }
  return ctx;
};

export { SocialButtonContext, useSocialButton };
