import type { Dictionary } from "ramda";
import type { Command, CommandTransfer, State } from "./commands";
import fingerprint from "../../utils/fingerprint";

import projectCreate from "./commands/project.create";
import projectActivate from "./commands/project.activate";

const ctx: Worker = self as any;

const ref = {
  state: {} as State,
};

const commands = {
  [fingerprint(projectCreate)]: projectCreate,
  [fingerprint(projectActivate)]: projectActivate,
} as Dictionary<Command>;

ctx.onmessage = ({
  data: { id, fingerprint: fp, payload },
}: MessageEvent<CommandTransfer>) => {
  if (fp in commands) {
    const { state, resolution } = commands[fp](payload)(ref.state);
    ref.state = state || ref.state;
    ctx.postMessage({
      id,
      data: resolution,
    });
  } else {
    throw new RangeError("Unsupported command");
  }
};
