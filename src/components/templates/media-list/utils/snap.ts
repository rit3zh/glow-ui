export const getSnapOffsetsByCount = (
  screenWidth: number,
  itemCount: number
) => {
  return Array.from({ length: itemCount }, (_, i) => i * screenWidth);
};
