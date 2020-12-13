import { clamp } from "ramda";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { rubberbandIfOutOfBounds, useGesture } from "react-use-gesture";
import useMeasure from "react-use-measure";
import { useStorage } from "../model/hooks";
import UILineJoint from "./ui/UI.joint";
import UILines from "./ui/UI.lines";

const grid = [20, 20];

const dependencyDefenitions = [
  {
    name: "@entropy/map",
    signature: [
      {
        name: "mutation",
        description:
          "Mapping function that will be applied per element. It takes element as an argument and transforms it into another value.",
      },
      {
        name: "collection",
        description: "Collection of items to iterate mutation through",
      },
    ],
  },
  {
    name: "@entropy/pick",
    signature: [
      {
        name: "from",
        description: "Collection to pick value from",
      },
      {
        name: "what",
        description: "Index to pick value at",
      },
    ],
  },
  {
    name: "@entropy/math/add",
    signature: [
      {
        name: "a",
        description: "firsta adder",
      },
      {
        name: "b",
        description: "second adder",
      },
    ],
  },
];

type Node = {
  id: number;
  position: [number, number];
};
type StateConst<T = any> = Node & {
  value: T;
};
type StateLambda = Node & {
  ref: string;
  value?: number[];
};
type State = {
  nodes: Array<
    ({ type: "const" } & StateConst) | ({ type: "lambda" } & StateLambda)
  >;
};
const state: State = {
  nodes: [
    {
      id: 1,
      type: "const",
      position: [0, 0],
      value: {
        a: 1,
        b: 2,
        c: [3, 4, 5],
      },
    },
    {
      id: 2,
      type: "const",
      position: [0, 15],
      value: "c",
    },
    {
      id: 3,
      type: "lambda",
      ref: "@entropy/pick",
      position: [10, 0],
      value: [1, 2],
    },
    {
      id: 4,
      type: "const",
      position: [-10, 20],
      value: 5,
    },
    {
      id: 5,
      type: "lambda",
      ref: "@entropy/math/add",
      position: [0, 20],
      value: [4],
    },
    {
      id: 6,
      type: "lambda",
      position: [20, 0],
      ref: "@entropy/map",
      value: [5, 3],
    },
  ],
};

export default () => {
  const [ref, { width, height }] = useMeasure();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const activeProject = useStorage(["projectActive"]);
  useEffect(() => console.log(activeProject), [activeProject]);

  const onDrag = useCallback(({ active, delta }) => {
    setDragging(active);
    setOffset((prev) =>
      active
        ? [prev[0] + delta[0], prev[1] + delta[1]]
        : [
            clamp(Number.NEGATIVE_INFINITY, 0, prev[0]),
            clamp(Number.NEGATIVE_INFINITY, 0, prev[1]),
          ]
    );
  }, []);

  const bind = useGesture({
    onDrag,
    onWheel: ({ delta: [, delta], active }) => {
      if (active) {
        const sign = delta < 0 ? 1 : -1;
        setZoom((v) => clamp(0.3, 5)(v <= 1 ? v + sign * 0.1 : v + sign * 1));
      }
    },
  });
  return (
    <div
      className="absolute inset-0 overflow-hidden touch-action-none"
      {...bind()}
      ref={ref}
    >
      <div
        className={`pl-1/2 pt-1/2 ${
          dragging ? `` : `transition-transform duration-150`
        }`}
        style={{
          touchAction: "none",
          transform: `translate(${rubberbandIfOutOfBounds(
            offset[0],
            Number.NEGATIVE_INFINITY,
            0
          )}px, ${rubberbandIfOutOfBounds(
            offset[1],
            Number.NEGATIVE_INFINITY,
            0
          )}px) scale(${zoom})`,
        }}
      >
        <UILines>
          {({ update }) =>
            state.nodes.map((v) => (
              <div
                className="absolute transform top-0 left-0"
                key={v.id}
                style={{
                  touchAction: "none",
                  transform: `translate(${v.position[0] * grid[0]}px, ${
                    v.position[1] * grid[1]
                  }px)`,
                }}
              >
                <node.container>
                  {v.type === "const" ? (
                    <UILineJoint helix={4} onChange={update(true)(v.id)}>
                      <node.inline value={v.value} />
                    </UILineJoint>
                  ) : v.type === "lambda" ? (
                    <>
                      {v.value?.map((income, i) => (
                        <UILineJoint
                          helix={8}
                          key={i}
                          onChange={update(false)(income)(`${v.id}:${i}`)}
                        >
                          <node.input type={""} />
                        </UILineJoint>
                      ))}
                      <UILineJoint helix={4} onChange={update(true)(v.id)}>
                        <node.output type={""} />
                      </UILineJoint>
                    </>
                  ) : null}
                </node.container>
              </div>
            ))
          }
        </UILines>
      </div>
    </div>
  );
};

namespace node {
  export const container: FunctionComponent = ({ children }) => {
    return (
      <div className="glass-landed py-4 text-white text-opacity-75 font-secondary inline-flex flex-col">
        {children}
      </div>
    );
  };

  export const input: FunctionComponent<{
    name?: string;
    type: string;
  }> = ({ name = "" }) => {
    return (
      <div className="bg-black bg-opacity-25 flex justify-start items-center py-2 relative">
        <span className="w-4 h-px bg-white bg-opacity-50 my-auto" />
        <span className="pr-6 pl-4">{name}</span>
      </div>
    );
  };

  export const output: FunctionComponent<{ type: string }> = () => {
    return (
      <div className="bg-black bg-opacity-25 flex justify-end items-center py-2 relative">
        <span className="pr-4 pl-6 opacity-0">output</span>
        <span className="w-4 h-px bg-white bg-opacity-50 my-auto" />
      </div>
    );
  };

  export const inline: FunctionComponent<{ value: any }> = ({ value }) => {
    return (
      <div className="bg-black bg-opacity-25 flex justify-end items-center py-2 relative">
        <pre className="px-4">{JSON.stringify(value, null, 2)}</pre>
        <span className="w-4 h-px bg-white bg-opacity-50 my-auto" />
      </div>
    );
  };
}

const useFinder = () => {};
