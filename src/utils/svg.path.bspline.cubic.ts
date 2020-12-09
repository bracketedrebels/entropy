export default (amplification = .7) => (points: [number, number][]) => points.length >= 1
  ? points
    .slice(1)
    .reduce((acc, v, i, list) => {
      const prev = list[i - 1] || points[0];
      const dx = v[0] - prev[0];
      const dy = v[1] - prev[1];
      const modifier = Math.max(Math.min(amplification, 1), 0);
      return `${acc} c ${Math.round(dx * modifier)},${0} ${Math.round((1 - modifier) * dx)},${dy} ${dx},${dy}`;
    }, `M ${points[0][0]},${points[0][1]}`)
  : ""
