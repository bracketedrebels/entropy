import { Storage } from "../types";

export default (id: string) => (storage: Storage) => ({
  ...storage,
  projectActive: id,
});
