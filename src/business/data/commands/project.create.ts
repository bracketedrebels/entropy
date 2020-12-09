import type { State } from "./../commands";
import uid from "../../../utils/uid";

export default ({ dependencies }: { dependencies: string[] }) => (
  state: State
) => {
  const id = uid("project:");
  return {
    state: {
      ...state,
      projects: [
        ...(state.projects || []),
        {
          nodes: [] as Node[],
          id,
          dependencies,
        },
      ],
    } as State,
    resolution: id,
  };
};
