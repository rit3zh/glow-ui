import { createContext, useContext } from "react";

import type { IExpandableContext } from "./types";

const ExpandableContext = createContext<IExpandableContext | null>(null);

const useExpandable = (component: string): IExpandableContext => {
  const ctx = useContext(ExpandableContext);
  if (!ctx) {
    throw new Error(
      `${component} must be rendered inside <ExpandableMapView.Root>.`,
    );
  }
  return ctx;
};

export { ExpandableContext, useExpandable };
