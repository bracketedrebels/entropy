import { stat } from "fs";
import type { State } from "./../commands";

export default (projectId: string) => (state: State) => {
  const found = state.projects?.find((v) => v.id === projectId);
  if (!found) {
    throw new RangeError(`No project found with id: '${projectId}'`);
  }
  return {
    resolution: found?.nodes || [],
  };
};
