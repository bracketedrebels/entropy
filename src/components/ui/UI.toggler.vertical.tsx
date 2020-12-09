import { noop } from 'ramda-adjunct';
import React, { DetailedHTMLProps, FunctionComponent, HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import useMeasure from "react-use-measure"



export default (({ children, clear = true, className = "", style = {}, active = true, onTransitionEnd = noop, ...props }) => {
  const [ref, { height }] = useMeasure();
  const blockSize = useMemo(() => active ? height : 0, [active, height]);

  const [transitionInProgress, setTransitionInProgress] = useState(false);
  const onTransitionEndCB = useCallback((e) => (setTransitionInProgress(false), onTransitionEnd(e)), [onTransitionEnd]);
  useEffect(() => setTransitionInProgress(true), [blockSize]);

  const render = useMemo(() => !active && !transitionInProgress && clear ? null : children, [transitionInProgress, active, children, clear]);

  return (
    <div
      className={`${className} overflow-hidden transition-size duration-300 ease-in-out`}
      onTransitionEnd={onTransitionEndCB}
      style={{
        ...(style),
        blockSize
      }}
      {...props}
    >
      <div className="transition-none" ref={ref}>
        {render}
      </div>
    </div>
  )
}) as FunctionComponent<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  active?: boolean;
  clear?: boolean;
}>
