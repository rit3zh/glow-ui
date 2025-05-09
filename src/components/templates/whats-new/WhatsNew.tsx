import React, { useCallback, useRef, useState } from "react";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { WhatsNewContext } from "./context/WhatsNewContext";
import { WhatsNewProps } from "./WhatsNew.type";

export const WhatsNew: React.FC<WhatsNewProps> &
  React.FunctionComponent<WhatsNewProps> = ({
  children,
  blurTint,
}: WhatsNewProps) => {
  const sheetRef = useRef<TrueSheet>(null);

  const [content, setContent] = useState<React.ReactNode>(null);

  const open = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);
  return (
    <WhatsNewContext.Provider value={{ open, close, setContent }}>
      {children}
      <TrueSheet ref={sheetRef} sizes={["100%"]} blurTint={blurTint}>
        {content}
      </TrueSheet>
    </WhatsNewContext.Provider>
  );
};
