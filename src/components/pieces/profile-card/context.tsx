import { createContext, useContext } from "react";

import type { IProfileCardContext, TProfileComponents } from "./types";

const ProfileCardContext = createContext<IProfileCardContext | null>(null);

const useProfileCard = (
  component: TProfileComponents = "ProfileCard.Body",
): IProfileCardContext => {
  const ctx = useContext<IProfileCardContext | null>(ProfileCardContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <ProfileCard>.`);
  }
  return ctx;
};

export { ProfileCardContext, useProfileCard };
