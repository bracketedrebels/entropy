export default ([[x1, y1], [x2, y2]]: readonly [
  readonly [number, number],
  readonly [number, number]
]) => `${x1} ${y1} ${x2 - x1} ${y2 - y1}`;
