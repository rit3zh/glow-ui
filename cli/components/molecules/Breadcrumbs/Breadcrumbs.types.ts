import type { ReactNode } from "react";

export type BreadcrumbItemProps = {
  children: ReactNode;
  onPress?: () => void;
  isCurrent?: boolean;
  tint?: string;
  currentTint?: string;
  className?: string;
};

export type BreadcrumbsListProps = {
  children: ReactNode;
};

export type BreadcrumbsSeparatorProps = {
  children?: ReactNode;
};

export type BreadcrumbsProps = {
  children: ReactNode;
  style?: any;
};
