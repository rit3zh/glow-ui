import { Dimensions } from "react-native";

interface GetValueFromIndexProps {
  sheetSizes: number[];
  index: number;
}

const { height } = Dimensions.get("window");

export const getValueFromIndex = ({
  index,
  sheetSizes,
}: GetValueFromIndexProps): number => {
  if (index < 0 || index >= sheetSizes.length) {
    return 0;
  }

  const size = sheetSizes[index] as number | string;
  if (typeof size === "number") {
    return size;
  } else if (typeof size === "string" && size?.endsWith("%")) {
    const percentage = parseFloat(size) / 100;
    return height * percentage;
  }
  return height;
};
