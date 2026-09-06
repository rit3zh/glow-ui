import { useCallback, useState } from "react";
import { ITrayNavigation } from "./types";

function useTrayNavigation(
  defaultView: string,
  onViewChange?: (view: string) => void,
): ITrayNavigation {
  const [state, setState] = useState<{ stack: string[]; direction: number }>({
    stack: [defaultView],
    direction: 1,
  });

  const view = state.stack[state.stack.length - 1];

  const setView = useCallback(
    (next: string) => {
      setState((current) => {
        if (current.stack[current.stack.length - 1] === next) return current;
        return { stack: [...current.stack, next], direction: 1 };
      });
      onViewChange?.(next);
    },
    [onViewChange],
  );

  const goBack = useCallback(() => {
    setState((current) => {
      if (current.stack.length < 2) return current;
      const stack = current.stack.slice(0, -1);
      onViewChange?.(stack[stack.length - 1]);
      return { stack, direction: -1 };
    });
  }, [onViewChange]);

  const reset = useCallback((next: string) => {
    setState({ stack: [next], direction: 1 });
  }, []);

  return {
    view,
    direction: state.direction,
    canGoBack: state.stack.length > 1,
    setView,
    goBack,
    reset,
  };
}

export { useTrayNavigation };
export type { ITrayNavigation };
