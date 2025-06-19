import type { ReactNode } from "react";

interface AccordionType {
  children: ReactNode;
  className?: string;
}

interface AccordionTriggerTypes {
  children: React.ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
  className?: string;
}

interface AccordionContentTypes {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

interface AccordionItemTypes {
  children: ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
  className?: string;
}

export {
  AccordionContentTypes,
  AccordionItemTypes,
  AccordionTriggerTypes,
  AccordionType,
};
