import XXH from "xxhashjs";

const seed = Math.random();
const symbol = Symbol();
export default (v: Function) => {
  if (!Object.getOwnPropertySymbols(v).includes(symbol)) {
    Object.defineProperty(v, symbol, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: XXH.h64(v.toString(), seed).toString(),
    });
  }
  return Object.getOwnPropertyDescriptor(v, symbol)?.value as string;
};
