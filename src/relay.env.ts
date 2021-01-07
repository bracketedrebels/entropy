import { Environment, Network, RecordSource, Store } from "relay-runtime";

export default new Environment({
  network: Network.create((operation, variables) =>
    fetch(process.env.URL_API_GRAPHQL_GITHUB as string, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.TOKEN_API_GRAPHQL_GITHUB,
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    }).then((response) => response.json())
  ),
  store: new Store(new RecordSource()),
});
