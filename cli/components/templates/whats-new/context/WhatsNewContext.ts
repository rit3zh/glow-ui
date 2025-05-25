import { createContext, useContext } from "react";

type WhatsNewContextType = {
  open: () => void;
  close: () => void;
  setContent: (c: React.ReactNode) => void;
};

export const WhatsNewContext = createContext<WhatsNewContextType | undefined>(
  undefined
);

export const useWhatsNew = <T extends WhatsNewContextType>(): T => {
  const context = useContext(WhatsNewContext);
  if (!context)
    throw new Error(
      "WhatsNew.Trigger or Content must be used inside <WhatsNew>"
    );
  return context as T;
};
