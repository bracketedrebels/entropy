import { noop } from "ramda-adjunct";
import React, {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
  useState,
} from "react";
import UITogglerVertical from "./UI.toggler.vertical";

export const useStatus = (v?: Status) => useState(v);
export type Status = "inprogress" | "success" | "failure";

export default (({
  status = "inprogress",
  onTransitionEnd = noop,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`} {...props}>
      <UITogglerVertical
        active={status === "success"}
        clear={false}
        onTransitionEnd={(e) => status === "success" && onTransitionEnd(e)}
      >
        <div className="flex flex-no-wrap items-center">
          <span className="font-secondary text-3xl text-success mr-2">•</span>
          <span className="font-secondary text-base">success</span>
        </div>
      </UITogglerVertical>
      <UITogglerVertical
        active={status === "failure"}
        clear={false}
        onTransitionEnd={(e) => status === "failure" && onTransitionEnd(e)}
      >
        <div className="flex flex-no-wrap items-center">
          <span className="font-secondary text-3xl text-failure mr-2">•</span>
          <span className="font-secondary text-base">failure</span>
        </div>
      </UITogglerVertical>
      <UITogglerVertical
        active={status === "inprogress"}
        clear={false}
        onTransitionEnd={(e) => status === "inprogress" && onTransitionEnd(e)}
      >
        <div className="text-white text-opacity-75 font-secondary text-xl flex justify-evenly">
          <div className="animate-ping">.</div>
          <div className="animate-ping" style={{ animationDelay: ".2s" }}>
            .
          </div>
          <div className="animate-ping" style={{ animationDelay: ".4s" }}>
            .
          </div>
          <div className="animate-ping" style={{ animationDelay: ".6s" }}>
            .
          </div>
          <div className="animate-ping" style={{ animationDelay: ".8s" }}>
            .
          </div>
        </div>
      </UITogglerVertical>
    </div>
  );
}) as FunctionComponent<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    status?: Status;
  }
>;
