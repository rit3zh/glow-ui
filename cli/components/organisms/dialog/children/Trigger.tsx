import { StyleSheet, Pressable } from "react-native";
import React from "react";
import { DialogTriggerProps } from "../Dialog.types";
import { useDialog } from "../hooks/useDialog";

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
}: DialogTriggerProps): React.ReactNode & React.JSX.Element => {
  const { setOpen } = useDialog();
  return <Pressable onPress={() => setOpen(true)}>{children}</Pressable>;
};

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: "#babababa",
    marginBottom: 16,
    bottom: 2.5,
  },
});
