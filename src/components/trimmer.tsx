import React, {
  useState,
  useEffect,
  HTMLAttributes,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { identity, Omit, uniqueId, differenceBy, entries } from "lodash";
import { useSize, Measured } from "./measured";
import { Vector2, sub } from "../utils/vector";
import { Collection } from "lokijs";

export type Trimmer<T extends { id: string; position: Vector2 }> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "ref"
> & {
  finder?: [Vector2, Vector2];
  data?: T[];
  children?: (payload: { item: { id: string }; scale: Vector2 }) => JSX.Element;
};
export const Trimmer = <T extends { position: Vector2; id: string }>({
  data = [],
  finder = [Vector2.zero, Vector2.zero],
  children = identity,
  ...props
}: Trimmer<T>) => {
  const [renderables, { read, update, insert }] = useRectangles();
  useEffect(
    () =>
      void insert(
        data.map((v) => ({
          id: v.id,
          top: v.position[1],
          right: Number.POSITIVE_INFINITY,
          bottom: Number.POSITIVE_INFINITY,
          left: v.position[0],
        }))
      ),
    [data, insert]
  );
  useEffect(() => {
    const [[left, top], [right, bottom]] = finder;
    const finderNotEmpty = left < right && top < bottom;
    if (finderNotEmpty) {
      read({
        $or: [
          {
            left: { $lte: left },
            top: { $lte: top },
            right: { $gte: right },
            bottom: { $gte: bottom },
          },
          {
            left: { $lte: left },
            top: { $lte: top },
            right: { $gte: left },
            bottom: { $gte: top },
          },
          {
            left: { $lte: right },
            top: { $lte: bottom },
            right: { $gte: right },
            bottom: { $gte: bottom },
          },
          {
            left: { $gte: left },
            top: { $gte: top },
            right: { $lte: right },
            bottom: { $lte: bottom },
          },
        ],
      });
    }
  }, [finder, read]);

  const ref = useRef(null);
  const size = useSize(ref);

  const [scale, setScale] = useState(Vector2.one);
  useEffect(
    () =>
      setScale(
        (([w, h]) => [w / size[0], h / size[1]] as Vector2)(
          sub(finder[1], finder[0])
        )
      ),
    [size, finder]
  );

  const [translate, setTranslate] = useState(Vector2.zero);
  useEffect(() => setTranslate(finder[0]), [finder]);

  const [transform, setTransform] = useState("");
  useEffect(
    () =>
      setTransform(
        `translate(-${translate[0]}px, -${translate[1]}px) scale(${scale[0]}, ${scale[1]})`
      ),
    [translate, scale]
  );

  useEffect(() => console.log(renderables), [renderables]);

  return (
    <div {...props} ref={ref}>
      <div style={{ transform }}>
        {renderables.map((v) => (
          <Measured
            key={v.id}
            style={{
              top: v.top,
              left: v.left,
            }}
            className="absolute"
            dimensionsChanged={([w, h]) => {
              update([{ ...v, bottom: v.top + h, right: v.left + w }]);
            }}
          >
            <h3>{children({ item: v, scale })}</h3>
          </Measured>
        ))}
      </div>
    </div>
  );
};

const useRectangles = <
  T extends {
    id: string;
    top: number;
    right?: number;
    bottom?: number;
    left: number;
  }
>() => {
  const [data, setData] = useState<T[]>([]);
  const [query, setQuery] = useState<LokiQuery<T>>();
  const [view, setView] = useState<DynamicView<T>>();
  const collection = useMemo(
    () =>
      new Collection<T>(uniqueId(), {
        asyncListeners: true,
        disableMeta: true,
        indices: ["top", "right", "bottom", "left"],
        unique: ["id"],
      }),
    []
  );

  const insert = useCallback((payload: T[]) => collection.insert(payload), [
    collection,
  ]);
  const update = useCallback((payload: T[]) => collection.update(payload), [
    collection,
  ]);
  const remove = useCallback((payload: T[]) => collection.remove(payload), [
    collection,
  ]);

  useEffect(() => {
    const uid = uniqueId();
    setView(collection.addDynamicView(uid));
    return () => void collection.removeDynamicView(uid);
  }, [collection]);

  useEffect(() => {
    if (!!view && !!query) {
      const uid = uniqueId();
      view.applyFilter({
        type: "find",
        val: query,
        uid,
      });
      const listener = () =>
        setData((olddata) => {
          const newdata = view.data();
          const diff = differenceBy(newdata, olddata, (v) =>
            entries(v).sort().join("::")
          );
          return diff.length === 0
            ? olddata
            : [
                ...olddata.filter(({ id }) => !diff.find((v) => v.id === id)),
                ...diff,
              ];
        });
      view.addListener("rebuild", listener);
      return () => {
        view.removeFilter(uid);
        view.removeListener("rebuild", listener);
      };
    }
  }, [view, query]);

  return [data, { read: setQuery, insert, update, remove }] as const;
};
