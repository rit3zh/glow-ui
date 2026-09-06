import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import type { IRippleImage as IRipple } from "./types";
import { useClock, vec } from "@shopify/react-native-skia";
import { Gesture } from "react-native-gesture-handler";

interface IUseRipple extends Required<
  Pick<
    IRipple,
    | "amplitude"
    | "frequency"
    | "speed"
    | "decay"
    | "duration"
    | "width"
    | "height"
  >
> {}

const useRipple = <T extends IUseRipple>(options: T) => {
  const { amplitude, decay, duration, frequency, height, speed, width } =
    options;
  const clock = useClock();
  const touchX = useSharedValue(width / 2);
  const touchY = useSharedValue(height / 2);
  const touchStartTime = useSharedValue(-100000);

  const elapsedTime = useDerivedValue(() => {
    return (clock.value - touchStartTime.value) / 1000;
  }, [clock, touchStartTime]);

  const uniforms = useDerivedValue(() => {
    const elapsed = elapsedTime.value;
    const isActive = elapsed > 0 && elapsed < duration;

    return {
      u_origin: vec(touchX.value, touchY.value),
      u_time: isActive ? elapsed : 0,
      u_amplitude: amplitude,
      u_frequency: frequency,
      u_decay: decay,
      u_speed: speed,
    };
  }, [
    touchX,
    touchY,
    elapsedTime,
    amplitude,
    frequency,
    decay,
    speed,
    duration,
  ]);

  const start = (x: number, y: number) => {
    touchX.value = x;
    touchY.value = y;
    touchStartTime.value = clock.value;
  };

  const tap = Gesture.Tap().onStart((event) => {
    touchX.value = event.x;
    touchY.value = event.y;
    touchStartTime.value = clock.value;
  });

  return { uniforms, tap, start };
};

export { useRipple };
