import XXH from "xxhashjs";
import signed, { symbol } from "./signed";

export default (v: Function) => {
  return Object.getOwnPropertyDescriptor(signed(v), symbol)?.value as string;
};
