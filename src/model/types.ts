export type Storage = {
  projects?: {
    id: string;
    dependencies?: string[];
    name?: string;
    nodes?: {
      id: string;
      position?: [number, number];
      dimensions?: [number, number];
    }[];
  }[];
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

export type Task<T = any, U = any> = (payload: T) => (s: Storage) => Promise<U>;
export type Reducer<T = any> = (payload: T) => (s: Storage) => Storage;
