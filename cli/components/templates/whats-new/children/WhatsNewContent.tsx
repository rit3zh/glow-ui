import * as React from "react";
import { StyleSheet } from "react-native";
import type { WhatsNewContentProps } from "../WhatsNew.type";

import { useWhatsNew } from "../context/WhatsNewContext";

export const WhatsNewContent: React.FC<WhatsNewContentProps> &
  React.FunctionComponent<WhatsNewContentProps> = ({
  children,
}: WhatsNewContentProps): React.ReactNode => {
  const { setContent } = useWhatsNew();

  React.useEffect(() => {
    setContent(children);
  }, [children]);
  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
