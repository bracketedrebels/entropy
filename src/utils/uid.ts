import { Dictionary } from "ramda";

const tracker = {
  default: 0,
  named: {} as Dictionary<number>,
};

export default (prefix?: string) => {
  if (!prefix) {
    return `${++tracker.default}` as string;
  }
  if (!(prefix in tracker.named)) {
    tracker.named[prefix] = 0;
  }
  return `${prefix}${++tracker.named[prefix]}` as string;
}