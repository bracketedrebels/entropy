import XXH from "xxhashjs";

const seed = Math.random();
export const symbol = Symbol();
export default <T extends Function>(v: T) => {
  if (!Object.getOwnPropertySymbols(v).includes(symbol)) {
    Object.defineProperty(v, symbol, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: XXH.h64(v.toString(), seed).toString(),
    });
  }
  return v;
};
