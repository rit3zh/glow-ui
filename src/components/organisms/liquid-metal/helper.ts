import {
  AlphaType,
  ColorType,
  Skia,
  type SkImage,
  type SkRect,
} from "@shopify/react-native-skia";

const hexToRgb = <T extends string>(hex: T): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
};

const fitRect = <T extends SkImage | null>(
  image: T,
  width: number,
  height: number,
): SkRect => {
  if (!image || width <= 0 || height <= 0) {
    return Skia.XYWHRect(0, 0, width, height);
  }

  const scale = Math.min(width / image.width(), height / image.height());

  const imageWidth = image.width() * scale;
  const imageHeight = image.height() * scale;

  return Skia.XYWHRect(
    (width - imageWidth) / 2,
    (height - imageHeight) / 2,
    imageWidth,
    imageHeight,
  );
};

const emptyImage = (): SkImage => {
  const pixels = Skia.Data.fromBytes(new Uint8Array([0, 0, 0, 0]));

  return Skia.Image.MakeImage(
    {
      width: 1,
      height: 1,
      colorType: ColorType.RGBA_8888,
      alphaType: AlphaType.Unpremul,
    },
    pixels,
    4,
  )!;
};

const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export { degreesToRadians, emptyImage, fitRect, hexToRgb };
