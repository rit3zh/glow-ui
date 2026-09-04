import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { COLORS } from "./const";

type TSavePhase = "idle" | "loading" | "success" | "done";
interface ISaveButtonRoot {
  children?: ReactNode;
  readonly onSave?: () => void | Promise<void>;
  readonly onSaved?: () => void;
  readonly minLoading?: number;
  readonly successPause?: number;
  readonly resetAfter?: number;
  readonly disabled?: boolean;
  readonly colors?: Partial<typeof COLORS>;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISaveButtonSlot {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

export type { TSavePhase, ISaveButtonRoot, ISaveButtonSlot };
