export interface SeekBarProps {
  value: number;
  onValueChange: (value: number) => void;
  readonly width?: number;
  readonly height?: number;
  readonly activeHeight?: number;
  readonly activeColor?: string;
  readonly inactiveColor?: string;
  readonly disabled?: boolean;
  readonly tapToSeek?: boolean;
  readonly thumbSize?: number;
  readonly thumbColor?: string;
  readonly showThumb?: boolean;
  readonly trackScale?: number;
  readonly thumbScale?: number;
  readonly containerScale?: number;
}
