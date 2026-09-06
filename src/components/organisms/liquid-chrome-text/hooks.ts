import { useEffect, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  AppState,
  Platform,
  type TextStyle,
} from "react-native";
import {
  Skia,
  matchFont,
  useFont,
  type DataSourceParam,
  type SkFont,
} from "@shopify/react-native-skia";
import { buildChromeField } from "./helper";
import type { IChromeField, IUseChromeField, TSkiaWeight } from "./types";
import { BASE_FONT_SIZE, NAMED_WEIGHTS } from "./const";

const weightToNumber = (weight: TextStyle["fontWeight"]): number => {
  if (weight == null) return 400;
  if (typeof weight === "number") return weight;
  const named = NAMED_WEIGHTS[weight.toLowerCase()];
  if (named) return named;
  const parsed = parseInt(weight, 10);
  return Number.isFinite(parsed) ? parsed : 400;
};

const toSkiaWeight = (weight: TextStyle["fontWeight"]): TSkiaWeight => {
  const n = Math.min(
    900,
    Math.max(100, Math.round(weightToNumber(weight) / 100) * 100),
  );
  return String(n) as TSkiaWeight;
};

const useSystemFont = (
  fontFamily: string | undefined,
  fontWeight: TextStyle["fontWeight"],
  skip: boolean,
): SkFont | null =>
  useMemo(() => {
    if (skip) return null;

    const family =
      fontFamily ??
      Platform.select({
        ios: "Helvetica",
        android: "sans-serif",
        default: "serif",
      });

    try {
      return matchFont({
        fontFamily: family,
        fontSize: BASE_FONT_SIZE,
        fontWeight: toSkiaWeight(fontWeight),
      });
    } catch {
      const typeface = Skia.FontMgr.System().matchFamilyStyle(family, {
        weight: weightToNumber(fontWeight),
      });
      return typeface ? Skia.Font(typeface, BASE_FONT_SIZE) : null;
    }
  }, [skip, fontFamily, fontWeight]);

const useChromeFont = (
  fontSource: DataSourceParam | undefined,
  fontFamily: string | undefined,
  fontWeight: TextStyle["fontWeight"],
): SkFont | null => {
  const custom = useFont(fontSource ?? null, BASE_FONT_SIZE);
  const system = useSystemFont(fontFamily, fontWeight, !!fontSource);
  return fontSource ? custom : system;
};

const useReduceMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduced(value);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return reduced;
};

const useAppActive = (): boolean => {
  const [active, setActive] = useState(
    () => AppState.currentState === "active",
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) =>
      setActive(state === "active"),
    );
    return () => sub.remove();
  }, []);

  return active;
};

const useChromeField = <T extends IUseChromeField>(
  opts: T,
): IChromeField | null => {
  const {
    text,
    font,
    width,
    height,
    scale,
    fontSizeRatio,
    widthRatio,
    letterSpacing,
    bulge,
  } = opts;
  const [field, setField] = useState<IChromeField | null>(null);

  useEffect(() => {
    if (!font || !(width > 0) || !(height > 0)) return;

    let cancelled = false;
    const handle = requestAnimationFrame(() => {
      if (cancelled) return;
      const built = buildChromeField({
        text,
        font,
        width,
        height,
        scale,
        fontSizeRatio,
        widthRatio,
        letterSpacing,
        bulge,
      });
      if (!cancelled && built) setField(built);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(handle);
    };
  }, [
    text,
    font,
    width,
    height,
    scale,
    fontSizeRatio,
    widthRatio,
    letterSpacing,
    bulge,
  ]);

  return field;
};

export { useChromeFont, useReduceMotion, useAppActive, useChromeField };
