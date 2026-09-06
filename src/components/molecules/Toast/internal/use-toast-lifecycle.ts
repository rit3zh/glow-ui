import { useCallback, useEffect, useRef } from "react";
import { withTiming } from "react-native-reanimated";

import { EXIT_MS } from "../toast.animation";
import type { IToastLifecycle } from "../Toast.types";

function useToastLifecycle({
  toast,
  duration,
  disabled,
  paused,
  presence,
  removeToast,
}: IToastLifecycle) {
  const removedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scheduleRemoval = useCallback(
    (delay: number) => {
      timersRef.current.push(setTimeout(() => removeToast(toast), delay));
    },
    [removeToast, toast],
  );

  const close = useCallback(
    (auto: boolean) => {
      if (removedRef.current) return;
      removedRef.current = true;

      if (auto) toast.onAutoClose?.(toast);
      else toast.onDismiss?.(toast);

      presence.value = withTiming(0, { duration: EXIT_MS });
      scheduleRemoval(EXIT_MS + 20);
    },
    [toast, presence, scheduleRemoval],
  );

  const dismissBySwipe = useCallback(
    (delay = 0) => {
      if (removedRef.current) return;
      removedRef.current = true;

      toast.onDismiss?.(toast);
      scheduleRemoval(delay + EXIT_MS + 20);
    },
    [toast, scheduleRemoval],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };
  }, []);

  useEffect(() => {
    if (toast.delete) close(false);
  }, [toast.delete, close]);

  const remaining = useRef(toast.duration ?? duration);
  useEffect(() => {
    remaining.current = toast.duration ?? duration;
  }, [toast.duration, duration]);

  useEffect(() => {
    if (disabled || toast.promise || remaining.current === Infinity) return;
    if (paused) return;

    const startedAt = Date.now();
    const id = setTimeout(() => close(true), Math.max(0, remaining.current));

    return () => {
      remaining.current -= Date.now() - startedAt;
      clearTimeout(id);
    };
  }, [paused, disabled, toast.promise, close]);

  return { close, dismissBySwipe };
}

export { useToastLifecycle };
