import { createContext, useContext } from "react";

import type {
  IListContextValue,
  IListItemContextValue,
  IListRowContextValue,
  TListContext,
} from "./types";

const ListContext = createContext<IListContextValue | null>(null);

const useList = <T extends TListContext>(component: T): IListContextValue => {
  const ctx = useContext(ListContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <List.Root>.`);
  }
  return ctx;
};

const ListRowContext = createContext<IListRowContextValue>({ isLast: true });
const useListRow = (): IListRowContextValue => useContext(ListRowContext);
const ListItemContentContext = createContext<boolean>(false);
const useIsInListItemContent = (): boolean =>
  useContext(ListItemContentContext);
const ListItemContext = createContext<IListItemContextValue | null>(null);

const useListItem = <T extends TListContext>(
  component: T,
): IListItemContextValue => {
  const ctx = useContext(ListItemContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <List.Item>.`);
  }
  return ctx;
};

export {
  ListContext,
  useList,
  ListRowContext,
  useListRow,
  ListItemContext,
  useListItem,
  ListItemContentContext,
  useIsInListItemContent,
};
