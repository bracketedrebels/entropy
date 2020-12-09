export default (helix: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => ({
  top,
  right,
  bottom,
  left,
}: {
  top: number;
  right: number;
  bottom: number;
  left: number;
}) => {
  switch (helix) {
    case 2:
      return [left + (right - left) / 2, top] as const;
    case 3:
      return [right, top] as const;
    case 4:
      return [right, top + (bottom - top) / 2] as const;
    case 5:
      return [right, bottom] as const;
    case 6:
      return [left + (right - left) / 2, bottom] as const;
    case 7:
      return [left, bottom] as const;
    case 8:
      return [left, top + (bottom - top) / 2] as const;
    case 9:
      return [left + (right - left) / 2, top + (bottom - top) / 2] as const;
    case 1:
    default:
  }
  return [left, top] as const;
};
