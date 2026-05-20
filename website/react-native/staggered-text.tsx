import React, { memo, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  Canvas,
  Text as SkiaText,
  useFont,
  matchFont,
  Blur,
  Group,
  SkFont,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  withDelay,
  useDerivedValue,
  interpolate,
  cancelAnimation,
} from "react-native-reanimated";
import type {
  IAnimationConfig,
  ICharacterAnimationParams,
  ICharacterMetrics,
  ICharacterRenderer,
  IStaggeredCharacterLayer,
  IStaggeredText,
  ITransitionCharacter,
} from "./types";
import { withBuildCharacterMetrics } from "./helper";
import { merge } from "./base";
import {
  DEFAULT_CONFIG,
  DEFAULT_ENTER_FROM,
  DEFAULT_ENTER_TO,
  DEFAULT_EXIT_FROM,
  DEFAULT_EXIT_TO,
} from "./const";

const CharRenderer: React.FC<ICharacterRenderer<SkFont>> &
  React.FunctionComponent<ICharacterRenderer<SkFont>> = memo<
  ICharacterRenderer<SkFont>
>(
  ({
    char,
    x,
    y,
    font,
    fontSize,
    color,
    from,
    to,
    progress,
  }:
    | React.ComponentProps<typeof CharRenderer>
    | ICharacterRenderer<SkFont>): React.ReactElement &
    React.ReactNode &
    React.JSX.Element => {
    const animatedY = useDerivedValue<number>(() => {
      const fromPx = from.translateY * fontSize;
      const toPx = to.translateY * fontSize;
      return interpolate(progress.value, [0, 1], [fromPx, toPx]);
    });

    const opacity = useDerivedValue<number>(() => {
      const mid = (from.opacity + to.opacity) / 2;
      return interpolate(
        progress.value,
        [0, 0.5, 1],
        [from.opacity, mid, to.opacity],
      );
    });

    const blurAmount = useDerivedValue<number>(() =>
      interpolate(progress.value, [0, 1], [from.blur, to.blur]),
    );

    const scaleVal = useDerivedValue<number>(() =>
      interpolate(progress.value, [0, 1], [from.scale, to.scale]),
    );

    const transform = useDerivedValue(() => [
      { translateX: x },
      { translateY: y + animatedY.value },
      { scale: scaleVal.value },
      { translateX: -x },
    ]);

    return (
      <Group transform={transform} origin={{ x, y }}>
        <Group opacity={opacity}>
          <Blur blur={blurAmount} />
          <SkiaText x={x} y={0} text={char} font={font} color={color} />
        </Group>
      </Group>
    );
  },
);

const StaggeredTransitionCharacter: React.FC<ITransitionCharacter<SkFont>> &
  React.FunctionComponent<ITransitionCharacter<SkFont>> = memo<
  ITransitionCharacter<SkFont>
>(
  ({
    char,
    x,
    y,
    delay,
    font,
    fontSize,
    color,
    from,
    to,
    direction,
    config,
    triggerSnapshot,
    ...props
  }:
    | React.ComponentProps<typeof StaggeredTransitionCharacter>
    | ITransitionCharacter<SkFont>): React.ReactElement &
    React.ReactNode &
    React.JSX.Element => {
    const progress = useSharedValue<number>(direction === "in" ? 1 : 0);

    useEffect(() => {
      const target = direction === "in" ? 0 : 1;
      const easing =
        direction === "in" ? config.enterEasing : config.exitEasing;

      progress.value = withDelay<number>(
        delay,
        withTiming<number>(target, { duration: config.duration, easing }),
      );
      return () => cancelAnimation<number>(progress);
    }, [triggerSnapshot, direction, delay, config]);

    return (
      <CharRenderer
        char={char}
        x={x}
        y={y}
        font={font}
        fontSize={fontSize}
        color={color}
        from={from}
        to={to}
        progress={progress}
      />
    );
  },
);

const StaggeredTextTransitionLayer: React.FC<IStaggeredCharacterLayer<SkFont>> &
  React.FunctionComponent<IStaggeredCharacterLayer<SkFont>> = memo<
  IStaggeredCharacterLayer<SkFont>
>(
  ({
    texts,
    activeIndex,
    fontSize,
    color,
    font,
    height,
    staggerFrom,
    enterFrom,
    enterTo,
    exitFrom,
    exitTo,
    config,
    letterSpacing,
  }:
    | React.ComponentProps<typeof StaggeredTextTransitionLayer>
    | IStaggeredCharacterLayer<SkFont>):
    | (React.ReactElement & React.ReactNode & React.JSX.Element)
    | null => {
    const trigger = useSharedValue<number>(0);
    const prevIndexRef = useRef<number>(activeIndex);

    const mesureMetrics = useMemo<ICharacterMetrics[][]>(
      () =>
        texts.map<ICharacterMetrics[]>((t) =>
          withBuildCharacterMetrics<SkFont>(
            t,
            font,
            staggerFrom,
            config.characterDelay,
            letterSpacing,
          ),
        ),
      [texts, font, staggerFrom, config.characterDelay, letterSpacing],
    );

    const maxWidth = useMemo<number>(
      () =>
        Math.max(
          ...mesureMetrics.map((m) => m.reduce((s, c) => s + c.width, 0)),
          200,
        ) + 100,
      [mesureMetrics],
    );

    const outgoingIndex = prevIndexRef.current;
    const incomingIndex = activeIndex;
    const isTransitioning = outgoingIndex !== incomingIndex;

    useEffect(() => {
      if (activeIndex !== prevIndexRef.current) {
        trigger.value += 1;
        prevIndexRef.current = activeIndex;
      }
    }, [activeIndex]);

    const triggerSnapshot = trigger.value;
    const baseY = height / 2 + fontSize / 3;

    const incomingMetrics = mesureMetrics[incomingIndex] ?? [];
    const outgoingMetrics = isTransitioning
      ? (mesureMetrics[outgoingIndex] ?? [])
      : [];
    const incomingTextWidth = incomingMetrics.reduce((s, c) => s + c.width, 0);
    const outgoingTextWidth = outgoingMetrics.reduce((s, c) => s + c.width, 0);

    const incomingOffsetX = (maxWidth - incomingTextWidth) / 2;
    const outgoingOffsetX = (maxWidth - outgoingTextWidth) / 2;

    return (
      <View style={[styles.container, { height }]}>
        <Canvas style={{ width: maxWidth, height }}>
          {isTransitioning &&
            outgoingMetrics.map((m, i) => (
              <StaggeredTransitionCharacter
                key={`out-${outgoingIndex}-${i}`}
                char={m.char}
                x={m.x + outgoingOffsetX}
                y={baseY}
                delay={m.delay}
                font={font}
                fontSize={fontSize}
                color={color}
                from={exitFrom}
                to={exitTo}
                direction="out"
                config={config}
                trigger={trigger}
                triggerSnapshot={triggerSnapshot}
              />
            ))}
          {incomingMetrics.map<React.ReactNode>((m, useless_index: number) => (
            <StaggeredTransitionCharacter
              key={`in-${incomingIndex}-${useless_index}`}
              char={m.char}
              x={m.x + incomingOffsetX}
              y={baseY}
              delay={m.delay}
              font={font}
              fontSize={fontSize}
              color={color}
              from={enterFrom}
              to={enterTo}
              direction="in"
              config={config}
              trigger={trigger}
              triggerSnapshot={triggerSnapshot}
            />
          ))}
        </Canvas>
      </View>
    );
  },
);

export const StaggeredText: React.FC<IStaggeredText> &
  React.FunctionComponent<IStaggeredText> = memo<IStaggeredText>(
  ({
    texts,
    activeIndex = 0,
    fontSize = 24,
    color = "#ffffff",
    fontPath,
    height: heightProp,
    staggerFrom = "leading",
    letterSpacing = 1,
    enterFrom: enterFromProp,
    enterTo: enterToProp,
    exitFrom: exitFromProp,
    exitTo: exitToProp,
    animationConfig: configProp,
  }: React.ComponentProps<typeof StaggeredText> | IStaggeredText):
    | (React.ReactElement & React.ReactNode & React.JSX.Element)
    | null => {
    const config = merge<Required<IAnimationConfig>>(
      configProp,
      DEFAULT_CONFIG,
    );
    const enterFrom = merge<Required<ICharacterAnimationParams>>(
      enterFromProp,
      DEFAULT_ENTER_FROM,
    );
    const enterTo = merge<Required<ICharacterAnimationParams>>(
      enterToProp,
      DEFAULT_ENTER_TO,
    );
    const exitFrom = merge<Required<ICharacterAnimationParams>>(
      exitFromProp,
      DEFAULT_EXIT_FROM,
    );
    const exitTo = merge<Required<ICharacterAnimationParams>>(
      exitToProp,
      DEFAULT_EXIT_TO,
    );

    const height = heightProp ?? fontSize * 2;

    const loadedFont = useFont(fontPath ?? null, fontSize);

    const systemFont = useMemo(() => {
      const fontFamily = Platform.select({
        ios: "Helvetica",
        android: "sans-serif",
        default: "System",
      }) as string;
      return matchFont({ fontFamily, fontSize });
    }, [fontSize]);

    const font = loadedFont ?? systemFont;

    if (!font) return null;

    return (
      <StaggeredTextTransitionLayer
        texts={texts}
        activeIndex={activeIndex}
        fontSize={fontSize}
        color={color}
        font={font}
        height={height}
        staggerFrom={staggerFrom}
        enterFrom={enterFrom}
        enterTo={enterTo}
        exitFrom={exitFrom}
        exitTo={exitTo}
        config={config}
        letterSpacing={letterSpacing}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo<
  React.FC<IStaggeredText> & React.FunctionComponent<IStaggeredText>
>(StaggeredText);
