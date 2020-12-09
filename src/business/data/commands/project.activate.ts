import type { State } from "./../commands";

export default (id: string) => (state: State) => ({
  state: {
    ...state,
    projectActive: id,
  } as State,
});
