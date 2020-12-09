import React, { FunctionComponent, useMemo } from "react";
import svgPathBsplineCubic from "../../utils/svg.path.bspline.cubic";
import svgViewbox from "../../utils/svg.viewbox";

export default (({ from, to }) => {
  const [[left, top], [x2, y2]] = useLinePoints(from, to);
  const [width, height] = useBoxSizes(from, to);
  const viewbox = useViewbox(width, height);
  return (
    <svg
      viewBox={viewbox}
      className={`absolute transform${
        to[1] < from[1] ? " -translate-y-full" : ""
      }${to[0] < from[0] ? " -translate-x-full" : ""}`}
      style={{
        top,
        left,
        width,
        height,
      }}
    >
      <path
        className={`stroke-success stroke-1 transform${
          to[1] < from[1] ? " translate-y-full" : ""
        }${to[0] < from[0] ? " translate-x-full" : ""}`}
        fill="none"
        d={svgPathBsplineCubic()([
          [0, 0],
          [x2, y2],
        ])}
      />
    </svg>
  );
}) as FunctionComponent<{
  from: readonly [number, number];
  to: readonly [number, number];
}>;

const useLinePoints = (
  from: readonly [number, number],
  to: readonly [number, number]
) => useMemo(() => linePoints(from, to), [from, to]);

const useBoxSizes = (
  from: readonly [number, number],
  to: readonly [number, number]
) => useMemo(() => boxSizes(from, to), [from, to]);

const useViewbox = (w: number, h: number) =>
  useMemo(
    () =>
      svgViewbox([
        [0, 0],
        [w, h],
      ]),
    [w, h]
  );

const linePoints = (
  [x1, y1]: readonly [number, number],
  [x2, y2]: readonly [number, number]
) =>
  [
    [x1, y1],
    [Math.abs(x2 - x1), x2 > x1 ? y2 - y1 : y1 - y2],
  ] as const; // normalized lineend point

const boxSizes = (
  [x1, y1]: readonly [number, number],
  [x2, y2]: readonly [number, number]
) => [Math.abs(x2 - x1), Math.abs(y2 - y1)] as const;
