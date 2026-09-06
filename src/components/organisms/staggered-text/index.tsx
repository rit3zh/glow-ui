import React, { memo, useEffect, useMemo, useState } from "react";
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
  ICharacterRenderer,
  IStaggeredCharacterLayer,
  IStaggeredText,
  ITextMetrics,
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
    const animatedY = useDerivedValue<number>(() =>
      interpolate(
        progress.value,
        [0, 1],
        [from.translateY * fontSize, to.translateY * fontSize],
      ),
    );

    const opacity = useDerivedValue<number>(() =>
      interpolate(progress.value, [0, 1], [from.opacity, to.opacity]),
    );

    const blurAmount = useDerivedValue<number>(() =>
      interpolate(progress.value, [0, 1], [from.blur, to.blur]),
    );

    const scaleVal = useDerivedValue<number>(() =>
      interpolate(progress.value, [0, 1], [from.scale, to.scale]),
    );

    const transform = useDerivedValue(() => [
      { translateY: animatedY.value },
      { scale: scaleVal.value },
    ]);

    return (
      <Group transform={transform} origin={{ x, y }} opacity={opacity}>
        <Blur blur={blurAmount} />
        <SkiaText x={x} y={y} text={char} font={font} color={color} />
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
    const measured = useMemo<ITextMetrics[]>(
      () =>
        texts.map<ITextMetrics>((t) =>
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

    // Derive the transition during render so an unrelated re-render can't
    // unmount the outgoing characters mid-flight.
    const [renderedIndex, setRenderedIndex] = useState<number>(activeIndex);
    const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
    const [transitionId, setTransitionId] = useState<number>(0);

    if (renderedIndex !== activeIndex) {
      setOutgoingIndex(renderedIndex);
      setRenderedIndex(activeIndex);
      setTransitionId((n) => n + 1);
    }

    // Drop the faded-out characters once their animation has finished.
    useEffect(() => {
      if (outgoingIndex === null) return;
      const longestDelay = Math.max(
        0,
        ...(measured[outgoingIndex]?.characters.map((c) => c.delay) ?? [0]),
      );
      const id = setTimeout(
        () => setOutgoingIndex(null),
        config.duration + longestDelay,
      );
      return () => clearTimeout(id);
    }, [transitionId, outgoingIndex, measured, config.duration]);

    const incoming = measured[activeIndex];
    const outgoing = outgoingIndex !== null ? measured[outgoingIndex] : null;

    // Blur and vertical travel bleed past the glyph box; pad so nothing clips.
    const canvasWidth = useMemo<number>(
      () =>
        Math.ceil(Math.max(0, ...measured.map((m) => m.width)) + fontSize * 2),
      [measured, fontSize],
    );

    // Center on the font's own vertical extents rather than guessing with
    // fontSize / 3. `ascent` is negative (above the baseline).
    const baseY = useMemo<number>(() => {
      const { ascent, descent } = font.getMetrics();
      return height / 2 - (ascent + descent) / 2;
    }, [font, height]);

    if (!incoming) return null;

    const incomingOffsetX = (canvasWidth - incoming.width) / 2;
    const outgoingOffsetX = outgoing ? (canvasWidth - outgoing.width) / 2 : 0;

    return (
      <View style={[styles.container, { height }]}>
        <Canvas style={{ width: canvasWidth, height }}>
          {outgoing?.characters.map((m, i) => (
            <StaggeredTransitionCharacter
              key={`out-${transitionId}-${i}`}
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
              triggerSnapshot={transitionId}
            />
          ))}
          {incoming.characters.map<React.ReactNode>((m, i: number) => (
            <StaggeredTransitionCharacter
              key={`in-${activeIndex}-${i}`}
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
              triggerSnapshot={transitionId}
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
    const config = useMemo<Required<IAnimationConfig>>(
      () => merge<Required<IAnimationConfig>>(configProp, DEFAULT_CONFIG),
      [configProp],
    );
    const enterFrom = useMemo<Required<ICharacterAnimationParams>>(
      () =>
        merge<Required<ICharacterAnimationParams>>(
          enterFromProp,
          DEFAULT_ENTER_FROM,
        ),
      [enterFromProp],
    );
    const enterTo = useMemo<Required<ICharacterAnimationParams>>(
      () =>
        merge<Required<ICharacterAnimationParams>>(
          enterToProp,
          DEFAULT_ENTER_TO,
        ),
      [enterToProp],
    );
    const exitFrom = useMemo<Required<ICharacterAnimationParams>>(
      () =>
        merge<Required<ICharacterAnimationParams>>(
          exitFromProp,
          DEFAULT_EXIT_FROM,
        ),
      [exitFromProp],
    );
    const exitTo = useMemo<Required<ICharacterAnimationParams>>(
      () =>
        merge<Required<ICharacterAnimationParams>>(exitToProp, DEFAULT_EXIT_TO),
      [exitToProp],
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

    const font = fontPath ? loadedFont : systemFont;

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
