// rit3zh
// local-expo-module
// @ts-ignore
import React from "react";
import type { SeekBarProps } from "./src/SeekBar.types";
import { default as SeekBarView } from "./src/SeekBarView";
import { onBaseEvent } from "./src/utils";

export const SeekBar: React.FC<SeekBarProps> = (props): React.ReactNode => {
  return (
    <SeekBarView
      {...props}
      width={props.frame?.width}
      height={props.frame?.height}
      onEvent={(e) => {
        onBaseEvent(e, {
          onValueChange: (v) => {
            const newValue = v?.nativeEvent.onValueChange;
            props?.onValueChange!(newValue satisfies number as number);
          },
        });
      }}
    />
  );
};
