import React, { useEffect, useRef } from "react";
import { noop } from "lodash";
import { Vector2, equals } from "../utils/vector";
import useResizeObserver from "@react-hook/resize-observer";

export type Measured = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
> & {
  dimensionsChanged?: (dims: Vector2) => void;
  deps?: any[];
};
export const Measured = ({
  dimensionsChanged = noop,
  deps = [],
  ...props
}: Measured) => {
  const ref = useRef(null);
  const size = useSize(ref);
  useEffect(() => {
    dimensionsChanged(size);
  }, [dimensionsChanged, size]);
  return <div {...props} ref={ref} />;
};

export const useSize = (target: React.MutableRefObject<HTMLElement | null>) => {
  const [size, setSize] = React.useState(Vector2.zero);

  React.useLayoutEffect(() => {
    const { width, height } = target.current?.getBoundingClientRect() || {
      width: 0,
      height: 0,
    };
    setSize([Math.round(width), Math.round(height)]);
  }, []);

  useResizeObserver(target, (entry) => {
    const { width, height } = entry.contentRect;
    const dims = [Math.round(width), Math.round(height)] as Vector2;
    setSize((prev) => (equals(prev)(dims) ? prev : dims));
  });

  return size;
};
