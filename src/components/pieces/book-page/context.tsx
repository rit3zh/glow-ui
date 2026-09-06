import { createContext, useContext } from "react";

import type { IBookPageContext, TBookComponents } from "./types";

const BookPageContext = createContext<IBookPageContext | null>(null);

const useBookPage = (
  component: TBookComponents = "BookPage.Cover",
): IBookPageContext => {
  const ctx = useContext<IBookPageContext | null>(BookPageContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <BookPage>.`);
  }
  return ctx;
};

export { BookPageContext, useBookPage };
