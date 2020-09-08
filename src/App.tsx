import React, { useState, useEffect, useRef } from "react";

import { Vector2, sum, sub, max } from "./utils/vector";
import { uniqueId } from "lodash";
import { useDrag } from "react-use-gesture";
import { Trimmer } from "./components/trimmer";
import { useSize } from "./components/measured";

const data = new Array(1)
  .fill(undefined)
  .map(() => ({ id: uniqueId("item"), position: Vector2.random(500) }));

const App = () => {
  const ref = useRef(null);
  const size = useSize(ref);
  const [finder, setFinder] = useState([Vector2.zero, Vector2.zero] as [
    Vector2,
    Vector2
  ]);
  useEffect(
    () => setFinder((prev) => [prev[0], sum(prev[0], [size[0], size[1]])]),
    [size]
  );

  const bindDrag = useDrag(({ delta }) => {
    setFinder((prev) => {
      const tl = max(sub(prev[0], delta), Vector2.zero);
      const normalizedDelta = sub(tl, prev[0]);
      const br = sum(prev[1], normalizedDelta);
      return [tl, br];
    });
  });

  return (
    <div {...bindDrag()} ref={ref} className="fixed inset-0 select-none">
      <Trimmer data={data} finder={finder} className="w-full h-full">
        {({ item: { id } }) => (
          <div className="border-solid border border-gray-400 bg-gray-200 p-4 m-0 font-sans font-thin">{`id: ${id}`}</div>
        )}
      </Trimmer>
    </div>
  );
};

export default App;
