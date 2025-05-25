import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type DialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type DialogComponent = {
  ({ children }: { children: ReactNode }): JSX.Element;
  Trigger: React.FC<DialogTriggerProps>;
  Content: React.FC<DialogContentProps>;
  Title: React.FC<DialogTitleProps>;
  Description: React.FC<DialogDescriptionProps>;
  Close: React.FC<DialogCloseProps>;
};

export type DialogContentProps = {
  children: ReactNode;
};
export type DialogTitleProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};
export type DialogDescriptionProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};
export type DialogCloseProps = {
  children: ReactNode;
};
export type DialogTriggerProps = {
  children: ReactNode;
};
