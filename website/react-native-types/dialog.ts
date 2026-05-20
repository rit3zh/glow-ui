import type { BlurTint } from "expo-blur";
import { type ReactNode } from "react";
import type { SharedValue } from "react-native-reanimated";
interface DialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface DialogProps {
  children: ReactNode;
}

interface DialogTriggerProps {
  children: ReactNode;
  readonly asChild?: boolean;
}

interface DialogContentProps {
  children: ReactNode;
  readonly onClose?: () => void;
}

interface DialogCloseProps {
  children: ReactNode;
  readonly asChild?: boolean;
}

interface DialogBackdropProps {
  readonly children?: ReactNode;
  readonly blurAmount?: number;
  readonly backgroundColor?: string;
  readonly blurType?: BlurTint;
}
interface DialogComponent extends React.FC<DialogProps> {
  Trigger: React.FC<DialogTriggerProps>;
  Content: React.FC<DialogContentProps>;
  Close: React.FC<DialogCloseProps>;
  Backdrop: React.FC<DialogBackdropProps>;
}
interface ExtendedDialogContextType extends DialogContextType {
  closeDialog: () => void;
  animationProgress: SharedValue<number>;
}
interface ExtendedDialogContentProps extends DialogContentProps {
  readonly isAnimating?: boolean;
  readonly setIsAnimating?: (animating: boolean) => void;
}

export {
  DialogContextType,
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogCloseProps,
  DialogComponent,
  DialogBackdropProps,
  ExtendedDialogContextType,
  ExtendedDialogContentProps,
};
