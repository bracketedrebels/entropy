import { clamp } from "ramda";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { rubberbandIfOutOfBounds, useGesture } from "react-use-gesture";
import useMeasure from "react-use-measure";
import { useStorage } from "../model/hooks";
import UILineJoint from "./ui/UI.joint";
import UILines from "./ui/UI.lines";

const grid = [20, 20];

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

export default () => {
  const [ref, { width, height }] = useMeasure();
  const [zoom, setZoom] = useState(1);
  const [[offsetX, offsetY], setOffset] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const activeProjectId = useStorage(["projectActive"]);
  const activeProject = useStorage(["projects", activeProjectId || ""]);

  const finder = useMemo(() => {}, [width, height, offsetX, offsetY, zoom]);

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
            offsetX,
            Number.NEGATIVE_INFINITY,
            0
          )}px, ${rubberbandIfOutOfBounds(
            offsetY,
            Number.NEGATIVE_INFINITY,
            0
          )}px) scale(${zoom})`,
        }}
      >
        <UILines>
          {({ update }) =>
            activeProject?.nodes?.map(({ id, position, type, value }) => (
              <div
                className="absolute transform top-0 left-0"
                key={id}
                style={{
                  touchAction: "none",
                  transform: `translate(${position[0] * grid[0]}px, ${
                    position[1] * grid[1]
                  }px)`,
                }}
              >
                <node.container>
                  {type === "const" ? (
                    <UILineJoint helix={4} onChange={update(true)(id)}>
                      <node.inline value={value} />
                    </UILineJoint>
                  ) : type === "lambda" ? (
                    <>
                      {value?.map((income, i) => (
                        <UILineJoint
                          helix={8}
                          key={i}
                          onChange={update(false)(income)(`${id}:${i}`)}
                        >
                          <node.input type={""} />
                        </UILineJoint>
                      ))}
                      <UILineJoint helix={4} onChange={update(true)(id)}>
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
