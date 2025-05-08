import type { ViewProps } from "react-native";

export interface SeekBarProps extends ViewProps {
  value: number;
  onValueChange?: (value: number) => void;
  frame?: IFrame;
  onEditingChage?: (isEditing: boolean) => void;
  trackHeight?: number;
  inactiveTrackCornerRadius?: number;
  activeTrackCornerRadius?: number;
  bufferedTrackCornerRadius?: number;
  handleSize?: number;
  bufferedValue?: number;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  handleColor?: string;
}
export interface SeekBarViewProps extends SeekBarProps {
  onEvent?: (event: any) => void;
  width?: number;
  height?: number;
  trackHeight?: number;
  inactiveTrackCornerRadius?: number;
  activeTrackCornerRadius?: number;
  bufferedTrackCornerRadius?: number;
  handleSize?: number;
  bufferedValue?: number;
  activeTrackColor?: string;
  inactiveTrackColor?: string;

  handleColor?: string;
}

export interface IFrame {
  width: number;
  height: number;
}
