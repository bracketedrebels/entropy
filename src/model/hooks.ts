import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import provider from "./provider";
import type { L, O } from "ts-toolbelt";
import fp from "../utils/fingerprint";
import { MessageType, Reducer, Storage, Task } from "./types";
import { uniqueId } from "lodash";

export const useReducer = <T>(reducer: Reducer<T>) => {
  const ctx = useContext(provider);
  const fingerprint = fp(reducer);
  return useCallback(
    (payload: T) => {
      ctx.postMessage({
        id: uniqueId(),
        type: MessageType.reduce,
        payload: {
          fingerprint,
          payload,
        },
      });
    },
    [ctx]
  );
};

export const useTask = <T, U>(task: Task<T, U>) => {
  const ctx = useContext(provider);
  const fingerprint = fp(task);
  return useCallback((payload: T) => {
    const id = uniqueId();
    ctx.postMessage({
      id,
      type: MessageType.run,
      payload: {
        fingerprint,
        payload,
      },
    });
    return new Promise<U>((resolve) => {
      ctx.addEventListener("message", function self({ data }) {
        if (data.type === MessageType.run && data.id === id) {
          resolve(data.payload);
          ctx.removeEventListener("message", self);
        }
      });
    });
  }, []);
};

export const useStorage = <
  T extends O.Paths<O.Required<Storage, keyof Storage, "deep">>
>(
  pick: T
) => {
  const ctx = useContext(provider);
  const [val, setVal] = useState();
  const key = useMemo(() => pick.join("."), [pick]);
  const handler = useCallback(
    ({
      data: {
        type,
        payload: { path, data },
      },
    }: MessageEvent) => {
      if (type === MessageType.reduce && path === key) {
        setVal(data);
      }
    },
    [key]
  );
  useEffect(() => {
    ctx.addEventListener("message", handler);
    return () => ctx.removeEventListener("message", handler);
  }, [ctx, handler]);
  useEffect(() => {
    ctx.postMessage({
      id: uniqueId(),
      type: MessageType.subscribe,
      payload: {
        path: key,
      },
    });
    return () =>
      ctx.postMessage({
        id: uniqueId(),
        type: MessageType.unsubscribe,
        payload: {
          path: key,
        },
      });
  }, [ctx, key]);

  return val as O.Path<Storage, T, 0>;
};
