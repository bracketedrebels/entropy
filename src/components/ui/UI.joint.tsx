import { noop } from "ramda-adjunct";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import useMeasure from "react-use-measure";
import computeHelix from "../../utils/helix";

export default (({ helix = 9, onChange = noop, children }) => {
  const [ref, descriptor] = useMeasure();
  const [x, y] = useMemo(() => computeHelix(helix)(descriptor), [
    descriptor,
    helix,
  ]);

  useEffect(() => onChange([x, y]), [x, y]);

  return <div ref={ref} children={children} />;
}) as FunctionComponent<{
  helix?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  onChange?: (position: [number, number]) => void;
  incoming?: boolean;
}>;
