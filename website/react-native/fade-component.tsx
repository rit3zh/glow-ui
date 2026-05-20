import React, {
  createContext,
  forwardRef,
  memo,
  type ReactNode,
  useContext,
  useImperativeHandle,
} from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { IFadeComponent, IFadeContext, IFadeHandle } from "./types";

const FadeContext = createContext<IFadeContext | null>(null);

const From: React.FC<IFadeComponent> = ({
  ...props
}: IFadeComponent): React.ReactNode & React.JSX.Element => {
  const ctx = useContext<IFadeContext | null>(FadeContext);
  if (!ctx)
    throw new Error("FadeComponent.From or To must be inside FadeComponent");

  const style = useAnimatedStyle<ViewStyle>(() => ({
    opacity: 1 - ctx.progress.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      {props.children}
    </Animated.View>
  );
};

const To: React.FC<IFadeComponent> = ({
  ...props
}: IFadeComponent): React.ReactNode & React.JSX.Element => {
  const ctx = useContext<IFadeContext | null>(FadeContext);
  if (!ctx)
    throw new Error("FadeComponent.From or To must be inside FadeComponent");
  const style = useAnimatedStyle<ViewStyle>(() => ({
    opacity: ctx.progress.value,
  }));
  return <Animated.View style={[style]}>{props.children}</Animated.View>;
};

const FadeBase = memo(
  forwardRef<IFadeHandle, IFadeComponent>(
    ({ children }, ref): React.ReactNode => {
      const progress = useSharedValue<number>(0);

      const toggle = () => {
        progress.value = withTiming<number>(progress.value === 0 ? 1 : 0, {
          duration: 1000,
        });
      };

      const showFrom = () => {
        progress.value = withTiming<number>(0, { duration: 1000 });
      };
      const showTo = () => {
        progress.value = withTiming<number>(1, { duration: 1000 });
      };

      useImperativeHandle<IFadeHandle, IFadeHandle>(
        ref,
        () => ({ toggle, from: showFrom, to: showTo }),
        [],
      );

      return (
        <FadeContext.Provider value={{ progress }}>
          <View style={styles.container}>{children}</View>
        </FadeContext.Provider>
      );
    },
  ),
);

export const FadeComponent = Object.assign(FadeBase, {
  From,
  To,
});

const styles = StyleSheet.create({
  container: {},
});
