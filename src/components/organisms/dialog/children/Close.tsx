import { Pressable } from "react-native";
import { useDialog } from "../hooks/useDialog";
import { ReactNode } from "react";

export const DialogClose = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { setOpen } = useDialog();
  return <Pressable onPress={() => setOpen(false)}>{children}</Pressable>;
};
