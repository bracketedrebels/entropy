import { PromiseOf } from "Any/_api";
import { Dictionary } from "ramda";

export type Storage = {
  projects?: Dictionary<{
    id: string;
    dependencies?: string[];
    name?: string;
    nodes?: {
      id: number;
      position: [number, number];
      dimensions?: [number, number];
      type: "const" | "lambda";
      value: number[];
    }[];
  }>;
  projectActive?: string;
};

export const enum MessageType {
  reduce,
  subscribe,
  unsubscribe,
  run,
}

export type CommandTransfer = {
  id: string;
  type: MessageType;
  payload: any;
};

export type Task<T extends unknown[] = [], U = any> = (
  ...payload: [...T]
) => (s: Storage) => Promise<U>;
export type TaskReturnType<T extends Task> = PromiseOf<
  ReturnType<ReturnType<T>>
>;
export type TaskPayloadType<T extends Task> = T extends Task<infer U>
  ? U
  : never;
export type Reducer<T extends unknown[] = []> = (
  ...payload: [...T]
) => (s: Storage) => Storage;
