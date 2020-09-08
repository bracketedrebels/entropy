import { zipWith } from "lodash";

export type Vector<T = number> = [...T[]];
export type Vector1<T = number> = [T, ...T[]];
export type Vector2<T = number> = [T, T, ...T[]];
export type Vector3<T = number> = [T, T, T, ...T[]];

/* predefined constants */

export namespace Vector1 {
  export const zero = [0] as Vector1;
  export const one = [1] as Vector1;
  export const minusOne = [-1] as Vector1;
  export const positiveInfinity = [Number.POSITIVE_INFINITY] as Vector1;
  export const negativeInfinity = [Number.NEGATIVE_INFINITY] as Vector1;
  export const random = (max = 1) => [Math.random() * max] as Vector1;
}

export namespace Vector2 {
  export const zero = [0, 0] as Vector2;
  export const one = [1, 1] as Vector2;
  export const minusOne = [-1, -1] as Vector2;
  export const positiveInfinity = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  ] as Vector2;
  export const negativeInfinity = [
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ] as Vector2;
  export const random = (max = 1) =>
    [Math.random() * max, Math.random() * max] as Vector2;
}

export namespace Vector3 {
  export const zero = [0, 0, 0] as Vector3;
  export const one = [1, 1, 1] as Vector3;
  export const minusOne = [-1, -1, -1] as Vector3;
  export const positiveInfinity = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  ] as Vector3;
  export const negativeInfinity = [
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ] as Vector3;
  export const random = (max = 1) =>
    [Math.random() * max, Math.random() * max, Math.random() * max] as Vector3;
}

/* common functions */

export const is = <T>(predicate: (v: T) => boolean) => (value: T) =>
  predicate(value);
export const are = <T>(predicate: (v: T[]) => boolean) => (value: T[]) =>
  predicate(value);
export const not = <T>(predicate: (v: T) => boolean) => (value: T) =>
  !predicate(value);
export const every = <T>(predicate: (v: T) => boolean) => (value: T[]) =>
  value.every(predicate);
export const some = <T>(predicate: (v: T) => boolean) => (value: T[]) =>
  value.some(predicate);

/* predicates */

export const eq = <T extends number>(sample: T) =>
  is((value: T) => value === sample);
export const neq = <T extends number>(sample: T) =>
  is((value: T) => value !== sample);
export const gt = <T extends number>(sample: T) =>
  is((value: T) => value > sample);
export const lt = <T extends number>(sample: T) =>
  is((value: T) => value < sample);
export const gte = <T extends number>(sample: T) =>
  is((value: T) => value >= sample);
export const lte = <T extends number>(sample: T) =>
  is((value: T) => value <= sample);

export const equals = <T extends Vector>(sample: T) => (vec: T) =>
  sample.length === vec.length && sample.findIndex((v, i) => vec[i] !== v) < 0;
export const inside = <T extends Vector>([from, to]: [T, T]) => (vec: T) =>
  !vec.find((v, i) =>
    from[i] <= to[i] ? v < from[i] || v > to[i] : v < to[i] || v > from[i]
  );

/* transformers */

export const from = <T>(v: { x: T } | { x: T; y: T } | { x: T; y: T; z: T }) =>
  [v.x, ...("y" in v ? [v.y] : []), ...("z" in v ? [v.z] : [])] as Vector<T>;
export const fromClientRect = (rect: ClientRect) =>
  [
    [rect.left, rect.top],
    [rect.right, rect.bottom],
  ] as [Vector2, Vector2];

export const bounds = (vecs: Vector[]) =>
  zipWith(...vecs, (...coords: number[]) => ({
    min: Math.min(...coords),
    max: Math.max(...coords),
  })).reduce(
    ([tl, br], { min, max }) => [
      [...tl, min],
      [...br, max],
    ],
    [[], []] as [Vector, Vector]
  ) as [Vector, Vector];

export const x = <T>(v: Vector1<T>) => v[0];
export const y = <T>(v: Vector2<T>) => v[1];
export const z = <T>(v: Vector3<T>) => v[2];

export const set = <T>(vec: Vector<T>, index: number, newvalue: T) =>
  vec.map((v, i) => (i === index ? newvalue : v));
export const xset = <T>(vec: Vector1<T>, newvalue: T) => set(vec, 0, newvalue);
export const yset = <T>(vec: Vector2<T>, newvalue: T) => set(vec, 1, newvalue);
export const zset = <T>(vec: Vector3<T>, newvalue: T) => set(vec, 2, newvalue);

export const sum = <T extends Vector>(v1: T, v2: T) =>
  v1.map((v, i) => v + v2[i]) as T;

export const sub = <T extends Vector>(v1: T, v2: T) =>
  v1.map((v, i) => v - v2[i]) as T;

export const mul = (scalar: number) => <T extends Vector>(vec: T) =>
  vec.map((v, i) => v * scalar) as T;

export const div = <S>(scalar: S extends 0 ? never : number) => <
  T extends Vector
>(
  vec: T
) => vec.map((v, i) => v / scalar) as T;

export const max = <T extends Vector>(v1: T, v2: T) =>
  v1.map((v, i) => Math.max(v, v2[i])) as T;

export const min = <T extends Vector>(v1: T, v2: T) =>
  v1.map((v, i) => Math.min(v, v2[i])) as T;

export const bevel = (factor: number) => <T extends Vector>(vectors: T[]) =>
  vectors.reduce(
    (acc, v) => zipWith(acc, v, (a, b) => a + (b - a) * factor) as T,
    vectors[0]
  );
export const mid = <T extends Vector>(vectors: T[]) => bevel(0.5)(vectors);

export const snap = <T extends Vector>(grid: T) => (vec: T) =>
  vec.map((v, i) => Math.round(v / grid[i]) * grid[i]);

// predicates factories next
