/**
 * AnimatedPathText
 *
 * Smoothly animates text along any SVG path by placing each character
 * individually with position + rotation derived on the UI thread.
 *
 * Why not <TextPath startOffset>?
 *   react-native-svg can't animate string props like "50%" via Reanimated,
 *   and negative startOffset (needed for seamless loops) doesn't work in RN.
 *   This component animates numeric x/y/rotation instead → buttery smooth.
 *
 * deps:
 *   react-native-svg
 *   react-native-reanimated
 *   svg-path-properties
 */

import React, { useMemo, useEffect, memo } from "react";
import Svg, { Path, Text as SvgText, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  type SharedValue,
  type EasingFunction,
} from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";

// ─── Animated SVG group ──────────────────────────────────────────
const AnimatedG = Animated.createAnimatedComponent(G);

// ─── Character width estimation ──────────────────────────────────
// We can't query native font metrics from a worklet, so we use a
// lookup that's accurate enough for proportional placement.
const NARROW = new Set([..."il|!.,;:'1"]);
const MEDIUM_NARROW = new Set([...'t()[]{}"fjr']);
const LOWER = new Set([..."abdeghnopquvcsxyz"]);
const WIDE_LOWER = new Set([..."mw"]);
const UPPER_NARROW = new Set([..."IJLT"]);
const UPPER_WIDE = new Set([..."MWGOQD"]);

function estimateCharWidth(char: string, fontSize: number): number {
  if (char === " ") return fontSize * 0.28;
  const code = char.codePointAt(0) ?? 0;
  if (code > 0x2600) return fontSize * 0.75; // emoji
  if ("✦★◆⚡→←↑↓•·―—∞".includes(char)) return fontSize * 0.65;
  if (NARROW.has(char)) return fontSize * 0.32;
  if (MEDIUM_NARROW.has(char)) return fontSize * 0.38;
  if (WIDE_LOWER.has(char)) return fontSize * 0.72;
  if (LOWER.has(char)) return fontSize * 0.52;
  if (UPPER_NARROW.has(char)) return fontSize * 0.5;
  if (UPPER_WIDE.has(char)) return fontSize * 0.72;
  if (code >= 65 && code <= 90) return fontSize * 0.62; // other uppercase
  if (code >= 48 && code <= 57) return fontSize * 0.52; // digits
  return fontSize * 0.52;
}

// ─── Path lookup table ───────────────────────────────────────────
// Pre-computed arrays of x, y, angleDeg for every pixel along the path.
// Stored as flat SharedValue arrays so worklets can read them.
interface PathInfo {
  xs: number[];
  ys: number[];
  angles: number[];
  totalLength: number;
  isClosed: boolean;
}

function buildPathInfo(pathD: string): PathInfo {
  const props = new svgPathProperties(pathD);
  const totalLength = props.getTotalLength();
  const isClosed = /[Zz]\s*$/.test(pathD.trim());
  const count = Math.ceil(totalLength) + 1;

  const xs = new Array<number>(count);
  const ys = new Array<number>(count);
  const angles = new Array<number>(count);

  for (let i = 0; i < count; i++) {
    const d = Math.min(i, totalLength);
    const p = props.getPointAtLength(d);
    const t = props.getTangentAtLength(d);
    xs[i] = p.x;
    ys[i] = p.y;
    angles[i] = Math.atan2(t.y, t.x) * (180 / Math.PI);
  }

  return { xs, ys, angles, totalLength, isClosed };
}

// ─── Character data ──────────────────────────────────────────────
interface CharEntry {
  char: string;
  midDist: number; // distance of the character centre from text start
}

function buildCharEntries(
  text: string,
  fontSize: number,
  letterSpacing: number,
  pathLength: number,
): CharEntry[] {
  const chars = Array.from(text);
  const singleWidth = chars.reduce(
    (sum, ch) => sum + estimateCharWidth(ch, fontSize) + letterSpacing,
    0,
  );

  if (singleWidth <= 0) return [];

  // Repeat text enough times to fully cover the path → no gaps.
  const copies = Math.ceil(pathLength / singleWidth) + 1;
  const entries: CharEntry[] = [];
  let dist = 0;

  for (let c = 0; c < copies; c++) {
    for (const ch of chars) {
      const w = estimateCharWidth(ch, fontSize) + letterSpacing;
      entries.push({ char: ch, midDist: dist + w / 2 });
      dist += w;
    }
  }

  return entries;
}

// ─── Single animated character ───────────────────────────────────
interface CharOnPathProps {
  char: string;
  midDist: number;
  progress: SharedValue<number>;
  xs: number[];
  ys: number[];
  angles: number[];
  totalLength: number;
  isClosed: boolean;
  fontSize: number;
  fontWeight: string;
  color: string;
}

const CharOnPath = memo<CharOnPathProps>(
  ({
    char,
    midDist,
    progress,
    xs,
    ys,
    angles,
    totalLength,
    isClosed,
    fontSize,
    fontWeight,
    color,
  }) => {
    const maxIdx = xs.length - 1;

    const animatedProps = useAnimatedProps(() => {
      "worklet";
      const offset = progress.value * totalLength;
      let dist = midDist + offset;

      // Wrap for closed paths; hide for open paths if out of range
      if (isClosed) {
        dist = ((dist % totalLength) + totalLength) % totalLength;
      }

      const idx = Math.max(0, Math.min(Math.round(dist), maxIdx));

      // For open paths, fade out characters beyond the path ends
      let opacity = 1;
      if (!isClosed && (dist < 0 || dist > totalLength)) {
        opacity = 0;
      }

      return {
        x: xs[idx],
        y: ys[idx],
        rotation: angles[idx],
        opacity,
      };
    });

    return (
      <AnimatedG animatedProps={animatedProps} origin="0, 0">
        <SvgText
          fontSize={fontSize}
          fontWeight={fontWeight}
          fill={color}
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {char}
        </SvgText>
      </AnimatedG>
    );
  },
);

// ─── Props ───────────────────────────────────────────────────────
interface AnimatedPathTextProps {
  /** SVG path `d` string */
  path: string;
  /** Text to animate along the path */
  text: string;

  /** SVG width (default "100%") */
  width?: number | string;
  /** SVG height (default "100%") */
  height?: number | string;
  /** SVG viewBox — keep padding ≥ fontSize on all sides */
  viewBox?: string;

  /** Font size in viewBox units (default 28) */
  fontSize?: number;
  /** Font weight (default "bold") */
  fontWeight?: string;
  /** Text fill colour (default "#fff") */
  color?: string;
  /** Extra space between characters (default 1) */
  letterSpacing?: number;

  /** Show the path as a dashed stroke (default false) */
  showPath?: boolean;
  /** Path stroke colour */
  pathColor?: string;
  /** Path stroke width */
  pathStrokeWidth?: number;
  /** Path stroke opacity (default 0.3) */
  pathOpacity?: number;

  /** 'auto' = continuous loop, 'driven' = external SharedValue (default "auto") */
  animationType?: "auto" | "driven";
  /** Duration in ms (auto, default 8000) */
  duration?: number;
  /** -1 = infinite (auto, default -1) */
  repeatCount?: number;
  /** Custom easing (auto, default Easing.linear) */
  easing?: EasingFunction;
  /** External progress 0-1 (driven mode) */
  progress?: SharedValue<number>;
}

// ─── Component ───────────────────────────────────────────────────
const AnimatedPathText: React.FC<AnimatedPathTextProps> = ({
  path: pathD,
  text,

  width = "100%",
  height = "100%",
  viewBox = "0 0 1000 400",

  fontSize = 28,
  fontWeight = "bold",
  color = "#ffffff",
  letterSpacing = 1,

  showPath = false,
  pathColor = "#555",
  pathStrokeWidth = 1.2,
  pathOpacity = 0.3,

  animationType = "auto",
  duration = 8000,
  repeatCount = -1,
  easing,

  progress: externalProgress,
}) => {
  // ── Path measurement ─────────────────────────────────
  const pathInfo = useMemo(() => buildPathInfo(pathD), [pathD]);

  // ── Character entries (repeated to fill path) ────────
  const entries = useMemo(
    () => buildCharEntries(text, fontSize, letterSpacing, pathInfo.totalLength),
    [text, fontSize, letterSpacing, pathInfo.totalLength],
  );

  // ── Auto animation driver ────────────────────────────
  const autoProgress = useSharedValue(0);

  useEffect(() => {
    if (animationType !== "auto") return;
    autoProgress.value = 0;
    autoProgress.value = withRepeat(
      withTiming(1, { duration, easing: easing ?? Easing.linear }),
      repeatCount,
      false,
    );
    return () => cancelAnimation(autoProgress);
  }, [animationType, duration, repeatCount, easing]);

  const activeProgress =
    animationType === "driven" && externalProgress
      ? externalProgress
      : autoProgress;

  // ── Render ───────────────────────────────────────────
  return (
    <Svg
      width={width}
      height={height}
      viewBox={viewBox}
      style={{ overflow: "visible" }}
    >
      {showPath && (
        <Path
          d={pathD}
          stroke={pathColor}
          strokeWidth={pathStrokeWidth}
          fill="none"
          strokeDasharray="5,4"
          opacity={pathOpacity}
        />
      )}

      {entries.map((entry, i) => (
        <CharOnPath
          key={i}
          char={entry.char}
          midDist={entry.midDist}
          progress={activeProgress}
          xs={pathInfo.xs}
          ys={pathInfo.ys}
          angles={pathInfo.angles}
          totalLength={pathInfo.totalLength}
          isClosed={pathInfo.isClosed}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
        />
      ))}
    </Svg>
  );
};

export default AnimatedPathText;
