import { useEffect, useState } from "react";
import { AccessibilityInfo, AppState } from "react-native";

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

export { useReduceMotion, useAppActive };
