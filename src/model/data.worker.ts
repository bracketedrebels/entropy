import { Dictionary, path } from "ramda";
import { CommandTransfer, MessageType, Reducer, Storage, Task } from "./types";
import fp from "../utils/fingerprint";

import projectActivate from "./reducers/project.activate";
import projectCreate from "./tasks/project.create";

const ctx: Worker = self as any;

const ref = {
  storage: {} as Storage,
};

const listeners = new Map<
  string,
  { getter: (state: Storage) => any; count: number }
>();

const mutations = {
  [fp(projectActivate)]: projectActivate,
} as Dictionary<Reducer>;

const tasks = {
  [fp(projectCreate)]: projectCreate,
} as Dictionary<Task>;

ctx.onmessage = ({
  data: { type, payload, id },
}: MessageEvent<CommandTransfer>) => {
  try {
    switch (type) {
      case MessageType.reduce:
        MutateMessageHandler(payload);
        break;
      case MessageType.subscribe:
        SubscribeMessageHandler(payload);
        break;
      case MessageType.unsubscribe:
        UnsubscribeMessageHandler(payload);
        break;
      case MessageType.run:
        TaskMessageHandler(id, type, payload);
        break;
      default:
        throw "Unsupported message type: " + type;
    }
  } catch (e) {
    throw {
      type,
      id,
      payload,
      error: e,
    };
  }
};

const TaskMessageHandler = (
  id: string,
  type: MessageType.run,
  {
    fingerprint,
    payload,
  }: {
    payload: any;
    fingerprint: string;
  }
) => {
  if (fingerprint in tasks) {
    tasks[fingerprint](payload)(ref.storage)
      .then((resolution) =>
        ctx.postMessage({
          id,
          type,
          payload: resolution,
        })
      )
      .catch((e) => {
        throw e;
      });
  } else {
    throw new RangeError("Unsupported task");
  }
};

const MutateMessageHandler = ({
  fingerprint,
  payload,
}: {
  fingerprint: string;
  payload: any;
}) => {
  if (fingerprint in mutations) {
    const cmd = mutations[fingerprint];
    const storage = cmd(payload)(ref.storage);
    OnStateUpdated(ref.storage, storage);
    ref.storage = storage;
  } else {
    throw new RangeError("Unsupported mutation");
  }
};

const SubscribeMessageHandler = ({ path: p }: { path: string }) => {
  const getter =
    listeners.get(p)?.getter ||
    ((parsed) => (storage: Storage) => path(parsed)(storage))(p.split("."));
  listeners.set(p, { getter, count: (listeners.get(p)?.count || 0) + 1 });
  dispatcher(getter(ref.storage), p);
};

const UnsubscribeMessageHandler = ({ path: p }: { path: string }) => {
  if (listeners.has(p)) {
    const count = listeners.get(p)?.count || 0;
    if (count > 1) {
      const getter =
        listeners.get(p)?.getter ||
        ((parsed) => (storage: Storage) => path(parsed)(storage))(p.split("."));
      listeners.set(p, { getter, count: (listeners.get(p)?.count || 0) - 1 });
    } else {
      listeners.delete(p);
    }
  }
};

const OnStateUpdated = (before: Storage, after: Storage) => {
  listeners.forEach(({ getter }, key) => {
    const data = getter(after);
    if (data !== getter(before)) {
      dispatcher(data, key);
    }
  });
};

const dispatcher = (data: any, key: string) =>
  ctx.postMessage({
    type: MessageType.reduce,
    payload: {
      path: key,
      data,
    },
  });
