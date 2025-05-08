import { NativeSyntheticEvent } from "react-native";

export function onBaseEvent(
  e: NativeSyntheticEvent<{ [key: string]: any }>,

  extraEvents?: {
    [key: string]: (e?: NativeSyntheticEvent<{ [key: string]: any }>) => void;
  }
) {
  const eventName = Object.keys(e.nativeEvent).filter((key) =>
    key.startsWith("on")
  )[0];

  if (extraEvents && extraEvents[eventName]) {
    extraEvents[eventName](e);
  }
}
