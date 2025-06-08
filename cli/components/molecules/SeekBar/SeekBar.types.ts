export interface SeekBarProps {
  value: number;
  onValueChange: (value: number) => void;
  width?: number;
  height?: number;
  activeHeight?: number;
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
  tapToSeek?: boolean;
}
