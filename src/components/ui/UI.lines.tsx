import { Dictionary } from "lodash";
import { toPairs } from "ramda";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import useMeasure from "react-use-measure";
import UILine from "./UI.line";

export default (({ children }) => {
  const [lines, setLines] = useState<
    Dictionary<{
      start: [number, number];
      ends: Dictionary<[number, number]>;
    }>
  >({});
  const update = useLineJointUpdater(setLines);
  const [ref, { top, left }] = useMeasure();
  const relative = useRelativePointConverter([left, top]);

  return (
    <div ref={ref} className="relative">
      {toPairs(lines).map(([startId, { ends, start }]) =>
        toPairs(ends || {}).map(([endId, end]) => (
          <UILine
            from={relative(start)}
            to={relative(end)}
            key={`${startId}:${endId}`}
          />
        ))
      )}
      {children({ update })}
    </div>
  );
}) as FunctionComponent<{
  children: (v: {
    update: <T extends boolean>(
      start: T
    ) => T extends true
      ? (id: number | string) => (point: [number, number]) => void
      : (
          startid: number | string
        ) => (endid: number | string) => (point: [number, number]) => void;
  }) => React.ReactNode;
}>;

const useLineJointUpdater = <
  T extends Dictionary<{
    start: [number, number];
    ends: Dictionary<[number, number]>;
  }>
>(
  setter: (mapper: (v: T) => T) => void
) => {
  const lineEndUpdater = useCallback(
    (startid: number | string) => (endid: number | string) => (
      point: [number, number]
    ) =>
      setter((v) => ({
        ...v,
        [startid]: {
          ...(v[startid] || {}),
          ends: {
            ...(v[startid]?.ends || {}),
            [endid]: point,
          },
        },
      })),
    [setter]
  );
  const lineStartUpdater = useCallback(
    (id: number | string) => (point: [number, number]) =>
      setter((v) => ({
        ...v,
        [id]: {
          ...(v[id] || {}),
          start: point,
        },
      })),
    [setter]
  );
  return useCallback(
    (start: boolean) => (start ? lineStartUpdater : lineEndUpdater),
    [lineEndUpdater, lineStartUpdater]
  ) as <T extends boolean>(
    start: T
  ) => T extends true ? typeof lineStartUpdater : typeof lineEndUpdater;
};

const useRelativePointConverter = (relative: readonly [number, number]) =>
  useCallback(
    (point: readonly [number, number]) =>
      [point[0] - relative[0], point[1] - relative[1]] as const,
    [relative]
  );
