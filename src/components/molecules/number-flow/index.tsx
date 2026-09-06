import React, { memo, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { NUMBER_FLOW_FONT_SIZE } from "./const";
import { Digit } from "./digit";
import { Separator } from "./separator";
import { styles } from "./styles";
import type { INumberFlowProps } from "./types";

const NumberFlow = memo(
  ({
    value,
    padStart = false,
    decimals,
    decimalSeparator = ".",
    groupSeparator,
    fontSize = NUMBER_FLOW_FONT_SIZE,
    color = "#fff",
    fontWeight = "600",
    style,
  }: INumberFlowProps) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    const absValue = Math.abs(safeValue);

    const formatted =
      decimals != null ? absValue.toFixed(decimals) : absValue.toString();
    const [integerPart, decimalPart = ""] = formatted.split(".");

    const integerValue = parseInt(integerPart, 10) || 0;
    const liveIntCount = Math.max(integerPart.length, padStart ? 2 : 1);
    const liveDecCount = decimalPart.length;
    const [intField, setIntField] = useState(liveIntCount);
    const [decField, setDecField] = useState(liveDecCount);
    useEffect(() => {
      if (liveIntCount > intField) setIntField(liveIntCount);
      if (liveDecCount > decField) setDecField(liveDecCount);
    }, [liveIntCount, intField, liveDecCount, decField]);

    const intCount = Math.max(intField, liveIntCount);
    const decCount = Math.max(decField, liveDecCount);
    const prevIntCount = useRef<number>(0);
    const prevDecCount = useRef<number>(0);
    const enteredIntFrom = prevIntCount.current;
    const enteredDecFrom = prevDecCount.current;
    useEffect(() => {
      prevIntCount.current = intCount;
      prevDecCount.current = decCount;
    });

    const intColumns = Array.from({ length: intCount }, (_, i) => {
      const digitsToRight = intCount - i - 1;
      return {
        place: Math.pow(10, digitsToRight),
        active: i >= intCount - liveIntCount,

        hasSep:
          !!groupSeparator && digitsToRight > 0 && digitsToRight % 3 === 0,
        enter: enteredIntFrom > 0 && i < intCount - enteredIntFrom,
      };
    });

    const decimalValue = decCount
      ? parseInt(decimalPart.padEnd(decCount, "0"), 10) || 0
      : 0;
    const decColumns = Array.from({ length: decCount }, (_, i) => ({
      place: Math.pow(10, decCount - i - 1),
      active: i < liveDecCount,
      enter: enteredDecFrom > 0 && i >= enteredDecFrom,
    }));

    const glyphProps = { fontSize, color, fontWeight };

    return (
      <View style={[styles.row, style]}>
        <Separator char="-" active={safeValue < 0} {...glyphProps} />

        {intColumns.map((col, i) => (
          <View key={`int-${col.place}`} style={styles.row}>
            <Digit
              value={integerValue}
              place={col.place}
              active={col.active}
              enter={col.enter}
              {...glyphProps}
            />
            {col.hasSep && groupSeparator && (
              <Separator
                char={groupSeparator}
                active={col.active && intColumns[i + 1]?.active === true}
                {...glyphProps}
              />
            )}
          </View>
        ))}

        {decCount > 0 && (
          <>
            <Separator
              char={decimalSeparator}
              active={liveDecCount > 0}
              {...glyphProps}
            />
            {decColumns.map((col) => (
              <Digit
                key={`dec-${col.place}`}
                value={decimalValue}
                place={col.place}
                active={col.active}
                enter={col.enter}
                {...glyphProps}
              />
            ))}
          </>
        )}
      </View>
    );
  },
);

export { NumberFlow };
