import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

/** Identifier a chip is selected by. */
type TChipValue = string | number;

type TChipComponents =
  | "AnimatedChip.Item"
  | "AnimatedChip.Icon"
  | "AnimatedChip.Label";

/** What a chip's children are told about the chip they live in. */
interface IChipState {
  /** Whether this chip is the selected one. */
  readonly selected: boolean;
  /** The chip's value. */
  readonly value: TChipValue;
}

/** Children that may be given as a node or as a function of chip state. */
type TChipRenderable = ReactNode | ((state: IChipState) => ReactNode);

interface IAnimatedChipGroup {
  children: ReactNode;
  /** Selected value — pass with `onValueChange` to control the group. */
  readonly value?: TChipValue;
  /** Selected value on first render when the group is uncontrolled. */
  readonly defaultValue?: TChipValue;
  readonly onValueChange?: (value: TChipValue) => void;
  /** Space between chips. */
  readonly gap?: number;
  /** Spring driving every chip's expansion. */
  readonly springConfig?: WithSpringConfig;
  /** Fire a light haptic tap on selection. Native only. */
  readonly haptics?: boolean;
  /**
   * Hold the row at the width of its widest arrangement so the group never
   * resizes as the selection moves. Turn off for a row that should shrink to
   * whatever is currently selected.
   */
  readonly reserveWidth?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAnimatedChipItem {
  children: ReactNode;
  /** Identifier handed to `onValueChange` when this chip is picked. */
  readonly value: TChipValue;
  /** Background once selected. */
  readonly activeColor?: string;
  /** Background while unselected. */
  readonly inactiveColor?: string;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAnimatedChipIcon {
  children: TChipRenderable;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAnimatedChipLabel {
  children: TChipRenderable;
  /** Colour of the label text. */
  readonly color?: string;
  readonly style?: StyleProp<TextStyle>;
}

interface IChipGroupContext {
  readonly selectedValue: TChipValue | undefined;
  readonly select: (value: TChipValue) => void;
  readonly springConfig: WithSpringConfig;
  /** Announce a chip to the group; returns its unregister. */
  readonly registerItem: (value: TChipValue) => () => void;
  /** Hand the group a chip's measured label width, for the reservation. */
  readonly reportLabelWidth: (value: TChipValue, width: number) => void;
}

interface IChipItemContext {
  readonly value: TChipValue;
  readonly selected: boolean;
  /** 0 collapsed → 1 expanded. Drives every animation on the chip. */
  readonly progress: SharedValue<number>;
  /** Natural width of the label, measured once it lays out. */
  readonly labelWidth: SharedValue<number>;
}

export type {
  TChipValue,
  TChipComponents,
  TChipRenderable,
  IChipState,
  IAnimatedChipGroup,
  IAnimatedChipItem,
  IAnimatedChipIcon,
  IAnimatedChipLabel,
  IChipGroupContext,
  IChipItemContext,
};
