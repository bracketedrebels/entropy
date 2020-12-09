import { useCallback, useContext } from "react";
import fingerprint from "../../utils/fingerprint";
import uid from "../../utils/uid";
import provider from "./provider";

export type State = {
  projects?: Array<{
    id: string;
    dependencies?: string[];
    name?: string;
    nodes?: Array<{
      id: string;
      position?: [number, number];
      dimensions?: [number, number];
    }>;
  }>;
  projectActive?: string;
};

export type Command<T = any, U = any> = (
  payload: T
) => (state: State) => { state?: State; resolution?: U };
export type CommandTransfer<T = any> = {
  id: string;
  fingerprint: string;
  payload: T;
};

export const useCommandRunner = <T, U = void>(command: Command<T, U>) => {
  const ctx = useContext(provider);
  const fp = fingerprint(command);
  return useCallback(
    (payload: T) => {
      const cmd = {
        id: uid("commandExecution"),
        fingerprint: fp,
        payload,
      };
      ctx.postMessage(cmd);
      return new Promise<U>((resolve, reject) => {
        function cbSuccess({ data: { data, id } }: MessageEvent) {
          if (id === cmd.id) {
            resolve(data);
            ctx.removeEventListener("message", cbSuccess);
          }
        }
        function cbError(ev: ErrorEvent) {
          reject(ev);
        }

        ctx.addEventListener("message", cbSuccess);
        ctx.addEventListener("error", cbError, { once: true });
      });
    },
    [ctx]
  );
};
