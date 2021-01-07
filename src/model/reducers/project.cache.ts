import { Storage } from "../types";

export default (project: any) => (storage: Storage) => ({
  ...storage,
  projects: {
    ...(storage.projects || {}),
    [project.id]: project,
  },
});
