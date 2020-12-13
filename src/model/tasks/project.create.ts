import uid from "../../utils/uid";

export default () => () => Promise.resolve(uid("project"));
