/**
 * @todo connet to real backend
 */
export default (url: string) => () =>
  fetch(url, { method: "GET" }).then((v) => v.json());
