import type { SharedValue } from "react-native-reanimated";

interface ICircularList {
  data: string[];
  scaleEnabled?: boolean;
  reverse?: boolean;
}

interface ICircularListItem {
  index: number;
  imageUri: string;
  contentOffset: SharedValue<number>;
  reverse: boolean;
  scaleEnabled?: boolean;
}

export type { ICircularList, ICircularListItem };
