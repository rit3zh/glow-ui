import * as React from "react";
import { useWhatsNew } from "../context/WhatsNewContext";
import type { WhatsNewTriggerProps } from "../WhatsNew.type";

export const WhatsNewTrigger: React.FC<WhatsNewTriggerProps> &
  React.FunctionComponent<WhatsNewTriggerProps> = ({
  children,
}: WhatsNewTriggerProps): React.ReactNode => {
  const { open } = useWhatsNew();
  return React.cloneElement(children as any, {
    onPress: open,
  });
};
